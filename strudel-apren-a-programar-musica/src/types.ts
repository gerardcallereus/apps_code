import React from 'react';

export type Lesson = {
  id: string;
  title: string;
  icon: React.ElementType;
  content: React.FC<{ setCode: (code: string) => void }>;
  initialCode: string;
  isReadOnly?: boolean;
  exercise?: {
    successMessage?: string;
    onCheck: (code: string) => { success: boolean; message: string };
  };
};
