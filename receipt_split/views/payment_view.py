from flask import request, current_app as app
from flask_api import status
from flask_jwt import current_identity, jwt_required

from sqlalchemy.sql import func, and_
from sqlalchemy import literal_column

from receipt_split.forms import PaymentForm
from receipt_split.models import Payment, Settlement
from receipt_split.meta import db
from receipt_split.schemas import payments_schema, payment_schema, \
    payment_create_schema, user_schema
from . import views, err, get_money_fmt


@views.route('/payments/<int:id>')
@views.route('/payments/<int:id>/<action>', methods=['GET', 'POST'])
@jwt_required()
def get_payment(id, action=None):
    payment = Payment.query.get(id)

    if not payment:
        return err("requested payment does not exist"), \
            status.HTTP_404_NOT_FOUND

    if payment.to_user != current_identity and \
            payment.from_user != current_identity:
        return err("you are not authorized to view this payment"), \
            status.HTTP_403_FORBIDDEN

    if action is None and request.method == 'GET':
        payment_dump = payment_schema.dump(payment)
        return payment_dump

    # accept or reject bahavior after

    if payment.to_user != current_identity:
        return err("you are not authorized to accept or reject this payment"),\
            status.HTTP_403_FORBIDDEN

    if (action == "accept" or action == "reject") and request.method == 'POST':
        # change accepted value

        if action == "accept":
            if payment.accept():
                db.session.commit()
        elif action == "reject":
            if payment.reject():
                db.session.commit()

        payment_dump = payment_schema.dump(payment)
        app.logger.debug("payments %s - %s", action, payment_dump)
        return payment_dump

    return err("Should not get here"), status.HTTP_500_INTERNAL_SERVER_ERROR


@views.route('/payments', methods=['GET', 'PUT'])
@jwt_required()
def get_payments():
    app.logger.debug("GET PAYMENTS/ %s", request.method)

    payments_result = {
        "payments_received": payments_schema.dump(
            Payment.get_received(current_identity)
        ),
        "payments_sent": payments_schema.dump(
            Payment.get_sent(current_identity)
        )
    }

    if request.method == 'PUT':
        Payment.archive_sent(current_identity)

    app.logger.debug("/payments result - %s", payments_result)
    return payments_result


@views.route('/payment', methods=['POST'])
@jwt_required()
def pay_user():
    # accept json with
    # message
    # amount
    # to_user

    if request.method == 'POST':
        if not request.is_json:
            return err("Not JSON"), status.HTTP_400_BAD_REQUEST

        json_data = request.get_json()

        app.logger.info("/pay POST - %s", json_data)

        form = PaymentForm.from_json(json_data)
        if not form.validate():
            app.logger.info("pay form errors - %s", form.errors)
            return form.errors, status.HTTP_400_BAD_REQUEST

        to_user = json_data.get("to_user")

        if to_user is None:
            return err("to_user is not specified"), status.HTTP_400_BAD_REQUEST

        json_data["from_user"] = user_schema.dump(current_identity)

        from_user_id = json_data.get("from_user", {}).get("id")
        to_user_id = json_data.get("to_user", {}).get("id")

        s = Settlement.get(
            from_user_id,
            to_user_id
        )

        app.logger.debug("settlement %s", s)
        app.logger.debug("settlement is None is: %s", s is None)

        if s is None:
            return err(f"no settlement from {from_user_id} to {to_user_id}"),\
                status.HTTP_400_BAD_REQUEST

        payment_amount = json_data.get("amount", 0)

        diff_amount = s.get_diff_amount(current_identity.id)
        owed_amount = s.get_owed_amount(current_identity.id)

        app.logger.debug(f"Payment amount ${get_money_fmt(payment_amount)} " +
                         f"and owed amount ${get_money_fmt(owed_amount)}")

        payment_sum = db.session.query(
            func.coalesce(
                func.sum(Payment.amount), literal_column("0.0")
            )
        ).filter(
            Payment.from_user_id == from_user_id,
            Payment.to_user_id == to_user_id,
            Payment.accepted.is_(None)
        ).scalar()

        if payment_sum >= diff_amount:
            return err(f"The total of your pending payments " +
                       f"(${get_money_fmt(payment_sum)}) already exceeds the" +
                       f" owed amount (${get_money_fmt(diff_amount)})"), \
                       status.HTTP_400_BAD_REQUEST

        app.logger.debug("BEFORE PAYMENT SCHEMA LOAD")
        app.logger.info("/pay POST JSON_DATA - %s", json_data)

        pay_data = payment_create_schema.load(json_data, session=db.session)
        pay_data.archived = False

        app.logger.debug("AFTER PAYMENT SCHEMA LOAD")

        if pay_data.to_user not in current_identity.friends:
            return err("Cannot pay a non-friended user"),\
                status.HTTP_400_BAD_REQUEST

        if pay_data.to_user == current_identity:
            return err("Cannot pay yourself"),\
                status.HTTP_400_BAD_REQUEST

        # pay_data.from_user = current_identity

        app.logger.debug("BEFORE DB COMMIT")

        db.session.add(pay_data)
        db.session.commit()

        app.logger.debug("%s pay_data archived", pay_data.archived)

        pay_dump = payment_schema.dump(pay_data)

        return pay_dump, status.HTTP_201_CREATED

    return err("should not get here"), status.HTTP_500_INTERNAL_SERVER_ERROR
