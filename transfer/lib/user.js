/**
 * Creacion de owner y receiver transaction processor function.
 * @param {org.transfer.tfg.CreateUser} createUser The createUser transaction instance.
 * @transaction
 */

function createUser(user) {
  return getParticipantRegistry('org.transfer.tfg.User')
    .then(function (participantRegistry) {
      return participantRegistry.exists(user.userId);
    })
    .then(function (exists) {
      if (!exists) {
        return getParticipantRegistry('org.transfer.tfg.User')
          .then(function (participantRegistry) {
            var newUser = getFactory().newResource('org.transfer.tfg', 'User', user.userId);
            newUser.name = user.name;
            newUser.lastName = user.lastName;
            newUser.email = user.email;
            newUser.date = user.date;
            newUser.country = user.country;
            newUser.phoneNumber = user.phoneNumber;
            return participantRegistry.add(newUser);
          });
      } else {
        throw new Error("Este correo ya esta registrado");
      }
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

/**
* Creacion de owner y receiver transaction processor function.
* @param {org.transfer.tfg.Login} login The login transaction instance.
* @transaction
*/
function login(user) {
  var userId = user.user.userId

  return getParticipantRegistry('org.transfer.tfg.User')
    .then(function (participantRegistry) {
      return participantRegistry.exists(userId);
    })
    .then(function (exists) {
      if (!exists) {
        throw new Error("El usuario no existe");
      }
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

/**
* Creacion de owner y receiver transaction processor function.
* @param {org.transfer.tfg.AddProfileFoto} login The login transaction instance.
* @transaction
*/
function addProfileFoto(user) {
  var userAux = user.user
  userAux.image = user.image;
  return getParticipantRegistry('org.transfer.tfg.User')
    .then(function (participantRegistry) {
      return participantRegistry.update(userAux);
    })
    .catch(function (error) {
      throw new Error(error);
    });
}
