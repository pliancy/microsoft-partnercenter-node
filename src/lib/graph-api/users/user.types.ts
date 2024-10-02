export interface GraphUser {
    aboutMe: string
    accountEnabled: true
    ageGroup: string
    assignedLicenses: { '@odata.type': 'microsoft.graph.assignedLicense' }[]
    assignedPlans: { '@odata.type': 'microsoft.graph.assignedPlan' }[]
    birthday: Date
    businessPhones: string[]
    city: string
    companyName: string
    consentProvidedForMinor: string
    country: string
    createdDateTime: Date
    creationType: string
    customSecurityAttributes: {
        '@odata.type': 'microsoft.graph.customSecurityAttributeValue'
    }
    department: string
    displayName: string
    employeeHireDate: Date
    employeeId: string
    employeeOrgData: { '@odata.type': 'microsoft.graph.employeeOrgData' }
    employeeType: string
    faxNumber: string
    givenName: string
    hireDate: Date
    id: string
    identities: { '@odata.type': 'microsoft.graph.objectIdentity' }[]
    imAddresses: string[]
    interests: string[]
    isResourceAccount: false
    jobTitle: string
    legalAgeGroupClassification: string
    licenseAssignmentStates: { '@odata.type': 'microsoft.graph.licenseAssignmentState' }[]
    lastPasswordChangeDateTime: Date
    mail: string
    mailboxSettings: { '@odata.type': 'microsoft.graph.mailboxSettings' }
    mailNickname: string
    mobilePhone: string
    mySite: string
    officeLocation: string
    onPremisesDistinguishedName: string
    onPremisesDomainName: string
    onPremisesExtensionAttributes: {
        '@odata.type': 'microsoft.graph.onPremisesExtensionAttributes'
    }
    onPremisesImmutableId: string
    onPremisesLastSyncDateTime: Date
    onPremisesProvisioningErrors: { '@odata.type': 'microsoft.graph.onPremisesProvisioningError' }[]
    onPremisesSamAccountName: string
    onPremisesSecurityIdentifier: string
    onPremisesSyncEnabled: true
    onPremisesUserPrincipalName: string
    otherMails: string[]
    passwordPolicies: string
    passwordProfile: { '@odata.type': 'microsoft.graph.passwordProfile' }
    pastProjects: string[]
    postalCode: string
    preferredDataLocation: string
    preferredLanguage: string
    preferredName: string
    provisionedPlans: { '@odata.type': 'microsoft.graph.provisionedPlan' }[]
    proxyAddresses: string[]
    responsibilities: string[]
    schools: string[]
    securityIdentifier: string
    serviceProvisioningErrors: { '@odata.type': 'microsoft.graph.serviceProvisioningXmlError' }[]
    showInAddressList: true
    signInActivity: { '@odata.type': 'microsoft.graph.signInActivity' }
    signInSessionsValidFromDateTime: Date
    skills: string[]
    state: string
    streetAddress: string
    surname: string
    usageLocation: string
    userPrincipalName: string
    userType: string
    calendar: { '@odata.type': 'microsoft.graph.calendar' }
    calendarGroups: { '@odata.type': 'microsoft.graph.calendarGroup' }[]
    calendarView: { '@odata.type': 'microsoft.graph.event' }[]
    calendars: { '@odata.type': 'microsoft.graph.calendar' }[]
    contacts: { '@odata.type': 'microsoft.graph.contact' }[]
    contactFolders: { '@odata.type': 'microsoft.graph.contactFolder' }[]
    createdObjects: { '@odata.type': 'microsoft.graph.directoryObject' }[]
    directReports: { '@odata.type': 'microsoft.graph.directoryObject' }[]
    drive: { '@odata.type': 'microsoft.graph.drive' }
    drives: { '@odata.type': 'microsoft.graph.drive' }[]
    events: { '@odata.type': 'microsoft.graph.event' }[]
    inferenceClassification: { '@odata.type': 'microsoft.graph.inferenceClassification' }
    mailFolders: { '@odata.type': 'microsoft.graph.mailFolder' }[]
    manager: { '@odata.type': 'microsoft.graph.directoryObject' }
    memberOf: { '@odata.type': 'microsoft.graph.directoryObject' }[]
    messages: { '@odata.type': 'microsoft.graph.message' }[]
    outlook: { '@odata.type': 'microsoft.graph.outlookUser' }
    ownedDevices: { '@odata.type': 'microsoft.graph.directoryObject' }[]
    ownedObjects: { '@odata.type': 'microsoft.graph.directoryObject' }[]
    photo: { '@odata.type': 'microsoft.graph.profilePhoto' }
    photos: { '@odata.type': 'microsoft.graph.profilePhoto' }[]
    registeredDevices: { '@odata.type': 'microsoft.graph.directoryObject' }[]
}
