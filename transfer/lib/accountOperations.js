/**
* Transaction to send money
* @param {org.transfer.tfg.SendMoney} sendMoney The sendMoney transaction instance.
* @transaction
*/

function sendMoney(info) {
    var origin = info.origin;
    var destination = info.destination;
    var amount = info.amount;
    var date = info.date;

    origin.amount = origin.amount - amount;
    destination.amount = destination.amount + amount;

    return getParticipantRegistry('org.transfer.tfg.User')
        .then(function (participantRegistry) {
            return participantRegistry.update(origin);
        })
        .then(function () {
            return getParticipantRegistry('org.transfer.tfg.User')
                .then(function (participantRegistry) {
                    return participantRegistry.update(destination);
                })
                .then(function () {
                    return getAssetRegistry('org.transfer.tfg.Operation')
                        .then(function (assetsRegistryOperation) {
                            return assetsRegistryOperation.getAll()
                                .then(function (allOperation) {
                                    var operationId = allOperation.length + 1;
                                    var operation = getFactory().newResource('org.transfer.tfg', 'Operation', operationId.toString());
                                    operation.user = origin;
                                    operation.destination = destination;
                                    operation.amount = amount;
                                    operation.nameDestination = destination.name + ' ' + destination.lastName;
                                    operation.nameOrigin = origin.name + ' ' + origin.lastName;
                                    operation.type = "SENT";
                                    operation.date = date;

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
* Transaction to request money
* @param {org.transfer.tfg.RequestMoney} requestMoney The requestMoney transaction instance.
* @transaction
*/

function requestMoney(info) {
    var origin = info.origin;
    var destination = info.destination;
    var amount = info.amount;
    var date = info.date;

    return getParticipantRegistry('org.transfer.tfg.User')
        .then(function (participantRegistry) {
            return participantRegistry.get(origin.userId);
        })
        .then(function () {
            return getParticipantRegistry('org.transfer.tfg.User')
                .then(function (participantRegistry) {
                    return participantRegistry.get(destination.userId);
                })
                .then(function () {
                    return getAssetRegistry('org.transfer.tfg.Request')
                        .then(function (assetsRegistryRequest) {
                            return assetsRegistryRequest.getAll()
                                .then(function (allRequest) {
                                    var requestId = allRequest.length + 1;
                                    var request = getFactory().newResource('org.transfer.tfg', 'Request', requestId.toString());
                                    request.origin = origin;
                                    request.destination = destination;
                                    request.nameDestination = destination.name + ' ' + destination.lastName;
                                    request.nameOrigin = origin.name + ' ' + origin.lastName;
                                    request.amount = amount;
                                    request.status = 'CREATED';
                                    return assetsRegistryRequest.add(request);
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
* Transaction to accept the request
* @param {org.transfer.tfg.AcceptRequest} acceptRequest The acceptRequest transaction instance.
* @transaction
*/

function acceptRequest(acceptRequest) {
    var request = acceptRequest.request;
    var origin = request.origin;
    var destination = request.destination;
    var amount = request.amount;

    request.status = "ACCEPTED";
    destination.amount = destination.amount - amount;
    origin.amount = origin.amount + amount;

    return getAssetRegistry('org.transfer.tfg.Request')
        .then(function (assetsRegistryRequest) {
            return assetsRegistryRequest.update(request);
        })
        .then(function () {
            return getParticipantRegistry('org.transfer.tfg.User')
                .then(function (participantRegistryD) {
                    return participantRegistryD.update(destination);
                })
                .then(function () {
                    return getParticipantRegistry('org.transfer.tfg.User')
                        .then(function (participantRegistryO) {
                            return participantRegistryO.update(origin);
                        })
                        .then(function () {
                            return getAssetRegistry('org.transfer.tfg.Operation')
                                .then(function (assetsRegistryOperation) {
                                    return assetsRegistryOperation.getAll()
                                        .then(function (allOperation) {
                                            var operationId = allOperation.length + 1;
                                            var operation = getFactory().newResource('org.transfer.tfg', 'Operation', operationId.toString());
                                            operation.user = origin;
                                            operation.destination = destination;
                                            operation.amount = amount;
                                            operation.nameDestination = origin.name + ' ' + origin.lastName;
                                            operation.nameOrigin = destination.name + ' ' + destination.lastName ;
                                            operation.type = "REQUEST";
                                            operation.date = acceptRequest.date;

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
        })
        .catch(function (error) {
            throw new Error(error);
        });
}

/**
* Transaction to reject the request
* @param {org.transfer.tfg.RejectRequest} rejectRequest The rejectRequest transaction instance.
* @transaction
*/

function rejectRequest(rejectRequest) {
    var request = rejectRequest.request;

    request.status = 'REJECTED';

    return getAssetRegistry('org.transfer.tfg.Request')
        .then(function (assetsRegistryRequest) {
            return assetsRegistryRequest.update(request);
        })
        .catch(function (error) {
            throw new Error(error);
        });
}
