import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    const baseTitle = '💰 MicroLoan';
    const fullTitle = title ? `${baseTitle} - ${title}` : baseTitle;
    document.title = fullTitle;
  }, [title]);
};

export default useDocumentTitle; 