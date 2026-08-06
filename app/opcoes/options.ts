export type OptionKind = "glitter-rain" | "glitter-cloud" | "light-beams" | "disco" | "camera-flash" | "starburst";

export const optionInfo: Record<OptionKind, { number: string; name: string; note: string }> = {
  "glitter-rain": { number: "01", name: "Chuva de glitter", note: "Cascata rosa, intensa e festiva" },
  "glitter-cloud": { number: "02", name: "Nuvem cintilante", note: "Partículas suaves flutuando no ar" },
  "light-beams": { number: "03", name: "Feixes de luz", note: "Luzes de pista varrendo a tela" },
  disco: { number: "04", name: "Disco prateado", note: "Reflexos de espelho e rosa cromado" },
  "camera-flash": { number: "05", name: "Flash paparazzi", note: "Flashes fotográficos e pose editorial" },
  starburst: { number: "06", name: "Explosão pink", note: "Raios gráficos e faíscas pulsantes" },
};
