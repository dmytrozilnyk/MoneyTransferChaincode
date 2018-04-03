/**
 * Creacion new user.
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
        throw new Error("This user already exist");
      }
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

/**
* Transaction to change security options
* @param {org.transfer.tfg.SecurityOptions} securityOptions The securityOptions transaction instance.
* @transaction
*/

function securityOptions(options) {
  var user = options.user;
  var security = options.security;
  var securityValue = options.securityValue;

  user.security = security;
  user.securityValue = securityValue;

  return getParticipantRegistry('org.transfer.tfg.User')
    .then(function (userParticipant) {
      return userParticipant.update(user);
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

/**
* Transaction to update user information
* @param {org.transfer.tfg.UpdateProfile} updateProfile The updateProfile transaction instance.
* @transaction
*/

function updateProfile(updateProfile) {
  var user = updateProfile.user;
    user.name = updateProfile.name;
    user.lastName = updateProfile.lastName;
    user.date = updateProfile.date;
    user.country = updateProfile.country;
    user.phoneNumber = updateProfile.phoneNumber;

  return getParticipantRegistry('org.transfer.tfg.User')
    .then(function (userParticipant) {
      return userParticipant.update(user);
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

/**
* Login. Check if the user exists in the blockchain
* @param {org.transfer.tfg.Login} login The login transaction instance.
* @transaction
*/

function login(user) {
  var userId = user.user.userId;


  return getParticipantRegistry('org.transfer.tfg.User')
    .then(function (participantRegistry) {
      return participantRegistry.exists(userId);
    })
    .then(function (exists) {
      if (!exists) {
        throw new Error("El usuario no existe");
      }else{
        return getAssetRegistry('org.transfer.tfg.LoginInfo')
          .then(function(assertRegistryLoginInfo){
            return assertRegistryLoginInfo.getAll()
            .then(function(allLoginInfoAssets){
              var loginInfoId = allLoginInfoAssets.length + 1;
              var loginInfo = getFactory().newResource('org.transfer.tfg', 'LoginInfo', loginInfoId.toString());
              loginInfo.user = user.user;
              loginInfo.loginDate = user.loginDate;
              return assertRegistryLoginInfo.add(loginInfo);
            })
            .catch(function (error) {
              throw new Error(error);
            });
          })
          .catch(function (error) {
            throw new Error(error);
          });
      }
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

/**
* Logout
* @param {org.transfer.tfg.Logout} logout The logout transaction instance.
* @transaction
*/

function logout(user) {
  var userId = user.user.userId;

  return getParticipantRegistry('org.transfer.tfg.User')
    .then(function (participantRegistry) {
      return participantRegistry.exists(userId);
    })
    .then(function (exists) {
      if (!exists) {
        throw new Error("El usuario no existe");
      }else{
        return getAssetRegistry('org.transfer.tfg.LogoutInfo')
          .then(function(assertRegistryLogoutInfo){
            return assertRegistryLogoutInfo.getAll()
            .then(function(allLogoutInfoAssets){
              var logoutInfoId = allLogoutInfoAssets.length + 1;
              var logoutInfo = getFactory().newResource('org.transfer.tfg', 'LogoutInfo', logoutInfoId.toString());
              logoutInfo.user = user.user;
              logoutInfo.logoutDate = user.logoutDate;
              return assertRegistryLogoutInfo.add(logoutInfo);
            })
            .catch(function (error) {
              throw new Error(error);
            });
          })
          .catch(function (error) {
            throw new Error(error);
          });
      }
    })
    .catch(function (error) {
      throw new Error(error);
    });
}


