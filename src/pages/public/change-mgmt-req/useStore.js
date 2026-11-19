import { create } from 'zustand';

// Safely extract orgId from localStorage
let orgIdFromStorage = '';
try {
  const userDataString = localStorage.getItem('user');
  if (userDataString) {
    const userData = JSON.parse(userDataString);
    orgIdFromStorage = userData?.orgId || '';
  }
} catch (error) {
  console.error('Failed to parse user data from localStorage:', error);
}

export const usePentestFormStore = create((set) => ({
  formData: {
    orgId: orgIdFromStorage,
    ownerId: '',
    title: '',
    description: '',
    isChangeRequest: true,

    changeRequestData: {
      requestTitle: '',
      requesterNameOrTeam: '',
      contactEmailOrPhone: '',
      dateOfRequest: '',
      changeRequestTicketId: '',
      plannedGoLiveDate: '',
      applicationServiceName: '',
      changeSummary: '',
      environmentToBeTested: '',
      testUrlOrIp: '',
      authenticationType: '',
      testCredentials: '',
      apiDocsOrSwaggerUrl: '',
      techStackFrameworks: '',
      thirdPartyIntegrations: '',
      dataSensitivity: '',
      isProductionImpacted: false,
      isCriticalChange: false,
      previousFindingsAddressed: '',
      deadlineForReport: '',
      goNoGoRequired: false,
      priorityLevel: 'Low',
    },
  },

  setFormData: (newData) =>
    set((state) => ({
      formData: { ...state.formData, ...newData },
    })),

  updateChangeRequestField: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        changeRequestData: {
          ...state.formData.changeRequestData,
          [field]: value,
        },
      },
    })),
}));
