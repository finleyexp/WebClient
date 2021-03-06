angular.module('proton.organization')
    .factory('changeOrganizationPassword', (gettextCatalog, organizationApi, passwords, pmcw) => {

        const I18N = {
            ERROR_UPDATE: gettextCatalog.getString('Error updating organization key recovery password', null, 'Error')
        };

        return ({ newPassword, organizationKey, creds }) => {
            const KeySalt = passwords.generateKeySalt();
            return passwords.computeKeyPassword(newPassword, KeySalt)
                .then((keyPassword) => pmcw.encryptPrivateKey(organizationKey, keyPassword))
                .then((PrivateKey) => organizationApi.updateBackupKeys({ PrivateKey, KeySalt }, creds))
                .then(({ data = {} }) => {
                    if (data.Code === 1000) {
                        return data;
                    }
                    throw new Error(data.Error || I18N.ERROR_UPDATE);
                });
        };
    });
