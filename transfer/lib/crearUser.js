/**
 * Creacion de owner y receiver transaction processor function.
 * @param {org.transfer.tfg.createUser} createUser The createUser transaction instance.
 * @transaction
 */

function createUser(user) {
  return getParticipantRegistry('org.transfer.tfg.User')
    .then(function (participantRegistry) {
      return participantRegistry.exists(user.email);
    })
    .then(function (exists) {
      if (!exists) {
        return getParticipantRegistry('org.transfer.tfg.User')
          .then(function (participantRegistry) {
            var newUser = getFactory().newResource('org.transfer.tfg', 'User', user.email);
            newUser.name = user.name;
            newUser.lastName = user.lastName;
            newUser.email = user.email;
            newUser.date = user.date;
            newUser.country = user.country;
            newUser.phoneNumber = user.phoneNumber;
            //newUser.password = user.password;
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
* @param {org.transfer.tfg.login} login The login transaction instance.
* @transaction
*/
function login(user) {
  var password = user.password;
  var userId = user.user.email

  return getParticipantRegistry('org.transfer.tfg.User')
    .then(function (participantRegistry) {
      return participantRegistry.exists(userId);
    })
    .then(function (exists) {
      if (exists) {
        return getParticipantRegistry('org.transfer.tfg.User')
          .then(function (participantRegistry) {
            return participantRegistry.get(userId);
          })
          .then(function (userAux) {
            if (password !== userAux.password) {
              throw new Error("La contraseña no es correcta");
            }
          });
      } else {
        throw new Error("El usuario no existe");
      }
    })
    .catch(function (error) {
      throw new Error(error);
    });
}
