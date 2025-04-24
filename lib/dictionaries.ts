import "server-only"

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  sv: () => import("./dictionaries/sv.json").then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
  return dictionaries[locale as "en" | "sv"]?.() ?? dictionaries.sv()
}
