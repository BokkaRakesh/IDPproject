export interface StudyField {
    key: string;
    name: string;
    status: string;
    comment?: string;
  }
  
  export interface Study {
    studyId: string;
    fields: StudyField[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface DropdownOption {
    label: string;
    value: string;
  }