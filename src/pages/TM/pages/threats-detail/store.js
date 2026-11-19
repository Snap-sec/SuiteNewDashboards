import { create } from 'zustand';


const useStore = create((set) => ({
    showConclusionModal: false,
    conclusionOf: "",
    conclusion: "",

    setShowConclusionModal: (show) => (set(() => ({ showConclusionModal: show }))),
    setConclusionOf: (conclusionOf) => (set(() => ({ conclusionOf }))),
    setConclusion: (text) => (set(() => ({ conclusion: text }))),
}));


export default useStore;