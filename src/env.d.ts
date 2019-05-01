interface ShadyCSS {
	styleSubtree(element: HTMLElement, overrideProperties?: object): void;
}

interface Window {
  ShadyCSS?: ShadyCSS;
}
