from flask import request, current_app as app
from flask_api import status
from flask_jwt import current_identity, jwt_required

from receipt_split.meta import db
from receipt_split.models import Receipt
from receipt_split.schemas import receipt_schema, receipts_schema,\
    receipt_create_schema
from receipt_split.forms import ReceiptForm
from receipt_split.views import reapply_balances
from . import views, calculate_balances, ok, err


@views.route('/receipt', methods=['GET'])
@jwt_required()
def receipt_list():
    receipts_owned = receipts_schema.dump(
        current_identity.receipts_owned_unresolved
    )

    receipts_owed = receipts_schema.dump(
        current_identity.receipts_owed_unresolved
    )

    receipts_owned_resolved = receipts_schema.dump(
        current_identity.receipts_owned_resolved
    )

    receipts_owed_resolved = receipts_schema.dump(
        current_identity.receipts_owed_resolved
    )

    receipt_result = {
        "receipts_owned": receipts_owned,
        "receipts_owed": receipts_owed,
        "receipts_owned_resolved": receipts_owned_resolved,
        "receipts_owed_resolved": receipts_owed_resolved
    }

    app.logger.info("/receipt GET receipts_owed - %s", receipts_owed)
    app.logger.info("/receipt GET - %s", receipt_result)

    return receipt_result, status.HTTP_200_OK


@views.route('/receipt/-1', methods=['POST', 'PUT'])
@jwt_required()
def receipt_create():
    if not request.is_json:
        return err("Not JSON"), status.HTTP_400_BAD_REQUEST

    json_data = request.get_json()

    # if id in json_data:
    #     del json_data["id"]

    form = ReceiptForm.from_json(json_data)
    if not form.validate():
        app.logger.info("receipt/-1 form errors - %s", form.errors)
        return form.errors, status.HTTP_400_BAD_REQUEST

    app.logger.info("receipt/-1 input json data - %s", json_data)

    receipt_data = receipt_create_schema.load(json_data, session=db.session)

    receipt_data.user = current_identity
    calculate_balances(receipt_data)

    app.logger.debug("receipt creation users: %s", receipt_data.users)
    # update all settlements

    db.session.add(receipt_data)
    db.session.commit()

    app.logger.debug("RECEIPT CREATED!")

    receipt_dump = receipt_schema.dump(receipt_data)

    app.logger.info("receipt/-1 return data with balances - %s",
                    receipt_dump)

    return receipt_dump, status.HTTP_201_CREATED


@views.route('/receipt/<int:id>', methods=['GET', 'PUT', 'PATCH', 'DELETE'])
@jwt_required()
def receipt_by_id(id):
    receipt = Receipt.query.get(id)

    app.logger.info("receipt/%s %s", id, receipt)
    app.logger.info("receipt/%s request %s", id, request.method)

    if not receipt:
        app.logger.info("receipt/%s does not exist", id)

        return err("Receipt with id does not exist"),\
            status.HTTP_404_NOT_FOUND

    if request.method == 'GET':
        receipt_dump = receipt_schema.dump(receipt)

        app.logger.info("receipt/%s GET %s", id, receipt_dump)

        return receipt_dump, status.HTTP_200_OK

    # TODO
    if receipt.user.id != current_identity.id:
        app.logger.info("receipt/%s unauthorized for %s", id,
                        current_identity)
        app.logger.debug("you do not own this receipt")
        return err("You do not own this receipt"),\
            status.HTTP_403_FORBIDDEN

    if request.method == 'DELETE':
        app.logger.info("Deleting receipt/%s", id)

        reapply_balances(receipt)
        db.session.delete(receipt)
        db.session.commit()

        return ok("Success"), status.HTTP_200_OK

    if not request.is_json:
        app.logger.info("receipt/%s is not JSON", id)
        return err("Not JSON"), status.HTTP_400_BAD_REQUEST

    json_data = request.get_json()

    form = ReceiptForm.from_json(json_data)
    if not form.validate():
        app.logger.info("receipt/%s form errors - %s", id, form.errors)
        return form.errors, status.HTTP_400_BAD_REQUEST

    if request.method == 'PUT' or request.method == 'PATCH':
        receipt_data = receipt_schema.load(json_data, session=db.session)
        calculate_balances(receipt_data)

        app.logger.debug("receipt creation users: %s", receipt_data.users)
        app.logger.debug("receipt user id: %s", current_identity.id)

        db.session.commit()

        receipt_dump = receipt_schema.dump(receipt_data)

        app.logger.info("receipt/%s return data with balances - %s", id,
                        receipt_dump)

        return receipt_dump, status.HTTP_200_OK

    app.logger.err("receipt/%s Unknown error", id)

    return err("should not get here"), status.HTTP_500_INTERNAL_SERVER_ERROR
