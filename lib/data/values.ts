export const getValues = (locale: string) => {
  return [
    {
      title: locale === "sv" ? "Digital Precision" : "Digital Precision",
      description:
        locale === "sv"
          ? "Vi använder den senaste digitala teknologin för att säkerställa precision, förutsägbarhet och optimala resultat i alla behandlingar."
          : "We use the latest digital technology to ensure precision, predictability, and optimal results in all treatments.",
    },
    {
      title: locale === "sv" ? "Personlig Omsorg" : "Personal Care",
      description:
        locale === "sv"
          ? "Varje patient är unik och förtjänar en individuellt anpassad behandlingsplan och personlig uppmärksamhet."
          : "Every patient is unique and deserves an individually tailored treatment plan and personal attention.",
    },
    {
      title: locale === "sv" ? "Kontinuerlig Utveckling" : "Continuous Development",
      description:
        locale === "sv"
          ? "Vi investerar kontinuerligt i utbildning och ny teknologi för att ligga i framkant inom modern tandvård."
          : "We continuously invest in education and new technology to stay at the forefront of modern dentistry.",
    },
  ]
}
