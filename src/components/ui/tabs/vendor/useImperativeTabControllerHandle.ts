import { useImperativeHandle } from 'react';
const useImperativeTabControllerHandle = (ref: any, setCurrentIndex: any, setCurrentScroll: any) => {
  useImperativeHandle(ref, () => {
    return {
      setTab: (tabIndex: number) => setCurrentIndex(tabIndex),
      verticalScrollTo: (y: number) => {
        setCurrentScroll(y)
      }
    };
  });
};
export default useImperativeTabControllerHandle;
