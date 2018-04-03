/**
* Transaction to deposit money
* @param {org.transfer.tfg.AddCreditCard} addCreditCard The addCreditCard transaction instance.
* @transaction
*/

function addCreditCard(creditCardInfo) {

    return getAssetRegistry('org.transfer.tfg.CreditCard')
        .then(function (assertRegistryCreditCard) {
            return assertRegistryCreditCard.getAll()
                .then(function (allCreditCardAssets) {
                    var creditCardId = allCreditCardAssets.length + 1;
                    var creditCard = getFactory().newResource('org.transfer.tfg', 'CreditCard', creditCardId.toString());
                    creditCard.owner = creditCardInfo.owner;
                    creditCard.ownerName = creditCardInfo.ownerName;
                    creditCard.number = creditCardInfo.number;
                    creditCard.expireDate = creditCardInfo.expireDate;
                    creditCard.cvv = creditCardInfo.cvv;
                    creditCard.addTime = creditCardInfo.addTime;
                    return assertRegistryCreditCard.add(creditCard);
                })
                .catch(function (error) {
                    throw new Error(error);
                });
        })
        .catch(function (error) {
            throw new Error(error);
        });
}

/**
* Transaction to deposit money
* @param {org.transfer.tfg.DeleteCreditCard} deleteCreditCard The deleteCreditCard transaction instance.
* @transaction
*/

function deleteCreditCard(creditCard) {
    return getAssetRegistry('org.transfer.tfg.CreditCard')
        .then(function (assetsRegistryCreditCard) {
            return assetsRegistryCreditCard.remove(creditCard.creditCard)
        })
        .catch(function (error) {
            throw new Error(error);
        });
}

/**
* Transaction to deposit money
* @param {org.transfer.tfg.DepositMoney} depositMoney The depositMoney transaction instance.
* @transaction
*/

function depositMoney(info) {
    var user = info.user;
    var creditCard = info.creditCard;
    var amount = info.amount;
    user.amount = user.amount + amount;

    return getParticipantRegistry('org.transfer.tfg.User')
        .then(function (participantRegistry) {
            return participantRegistry.update(user);
        })
        .then(function () {
            return getAssetRegistry('org.transfer.tfg.CreditCard')
                .then(function (assetsRegistryCreditCard) {
                    return assetsRegistryCreditCard.get(creditCard.creditCardId);
                })
                .then(function () {
                    return getAssetRegistry('org.transfer.tfg.Operation')
                        .then(function (assetsRegistryOperation) {
                            return assetsRegistryOperation.getAll()
                                .then(function (allOperation) {
                                    var operationId = allOperation.length + 1;
                                    var operation = getFactory().newResource('org.transfer.tfg', 'Operation', operationId.toString());
                                    operation.user = user;
                                    operation.creditCard = creditCard;
                                    operation.amount = amount;
                                    operation.nameDestination = user.name + ' ' + user.lastName;
                                    operation.nameOrigin = creditCard.number;
                                    operation.type = "DEPOSIT";
                                    operation.date = info.date;

                                    return assetsRegistryOperation.add(operation);
                                })
                                .catch(function (error) {
                                    throw new Error(error);
                                });
                        })
                        .catch(function (error) {
                            throw new Error(error);
                        });
                })
                .catch(function (error) {
                    throw new Error(error);
                });
        })
        .catch(function (error) {
            throw new Error(error);
        });
}

/**
* Transaction to withdraw money
* @param {org.transfer.tfg.WithdrawMoney} withdrawMoney The withdrawMoney transaction instance.
* @transaction
*/

function withdrawMoney(info) {

}
