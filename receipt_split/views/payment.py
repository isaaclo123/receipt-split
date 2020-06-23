from flask import request, current_app as app
from flask_api import status
from flask_jwt import current_identity, jwt_required

from receipt_split.models import Payment
from receipt_split.meta import db
from receipt_split.schemas import payments_schema, payment_schema
from . import views, err, pay_balances


@views.route('/payments/<int:id>')
@views.route('/payments/<int:id>/<action>', methods=['GET', 'POST'])
@jwt_required()
def get_payment(id, action=None):
    payment = Payment.query.get(id)

    if not payment:
        return err("requested payment does not exist"),
    status.HTTP_404_NOT_FOUND

    if payment.to_user != current_identity and \
            payment.from_user != current_identity:
        return err("you are not authorized to view this payment"),
    status.HTTP_401_UNAUTHORIZED

    if action is None and request.method == 'GET':
        payment_dump = payment_schema.dump(payment)
        return payment_dump

    # accept or reject bahavior after

    if payment.to_user != current_identity:
        return err("you are not authorized to accept or reject this payment"),
    status.HTTP_401_UNAUTHORIZED

    if (action == "accept" or action == "reject") and request.method == 'POST':
        # change accepted value

        if action == "accept":
            if payment.accept():
                pay_balances(payment.from_user)
                pay_balances(payment.to_user)

                db.session.commit()

        if action == "reject":
            if payment.reject():
                db.session.commit()

        payment_dump = payment_schema.dump(payment)
        app.logger.debug("payments %s - %s", action, payment_dump)
        return payment_dump

    return err("Should not get here"), status.HTTP_500_INTERNAL_SERVER_ERROR


@views.route('/payments', methods=['GET'])
@jwt_required()
def get_payments():
    app.logger.debug("GET PAYMENTS/")

    payments_result = {
        "payments_received": payments_schema.dump(
            Payment.get_received(current_identity)
        ),
        "payments_sent": payments_schema.dump(
            Payment.get_sent(current_identity)
        )
    }

    Payment.archive_sent(current_identity)
    app.logger.debug("/payments result - %s", payments_result)
    return payments_result
