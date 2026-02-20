const { beforeUserCreated, beforeUserSignedIn } = require('firebase-function/v2/identity');

exports.beforecreated = beforeUserCreated((event) => {
  return {
    customClaims: {
      role: 'authenticated'
    }
  };
});

exports.beforesignedin = beforeUserSignedIn((event) => {
  return {
    customClaims: {
      role: 'authenticated'
    }
  };
});
