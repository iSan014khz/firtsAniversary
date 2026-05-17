import FallingText  from "../utils/GravityBox";

const textoCarta = "Corazón, creo que no sabes la cantidad de sentimientos que me genera cumplir un año contigo, porque aunque sólo sea el vecino del cero hubieron 365 días donde estuve aprendiendo a amarte, entenderte, y conocerte más; pero no todo fue aprendizaje, también descubrí que cada día te amo más y nuestra relación se fortalece en todos los aspectos.\n\nEstoy muy orgulloso de todo lo que hemos hecho juntos y solos porqué aunque no siempre estemos físicamente cerca me inspiras a hacer cosas nuevas, a seguir intentando, a trabajar más duro, todo con el fin de poder ser más feliz contigo.\n\nSé que tenemos muchos deseos por cumplir pero primero Dios, te prometo que algún día no muy lejano las cosas cambiarán, esos viajes que tanto deseamos llegarán, esas experiencias que anhelamos llegarán, esa vida juntos tranquila y bonita llegará, alegrémonos porque esto sólo es el inicio.\n\nY en lo que las cosas se van acomodando seguiré siendo ese hombre que te apoye en todo, que te haga crecer, que te haga mejorar, que te motive, que te acompañe absolutamente en todo. Verte cumplir tus objetivos se ha convertido en uno de los míos. No tengas miedo de nada porque Dios y yo siempre estaremos contigo.\n\nTe amo,\nSantiago P.";

export default function Carta() {
  return (
    <div className="h-[250vh] w-screen">
      <FallingText
        text={textoCarta}
        highlightPhrases={[
          // "Corazón,",
          "Verte cumplir tus objetivos se ha convertido en uno de los míos.",
          "descubrí que cada día te amo más y nuestra relación se fortalece",
          "Estoy muy orgulloso de todo lo que hemos hecho juntos",
          "todo con el fin de poder ser más feliz contigo.","seguiré siendo ese hombre que te apoye en todo"
        ]}
        trigger="scroll"
        backgroundColor="transparent"
        wireframes={false}
        gravity={2}
        fontSize="1.7rem"
        mouseConstraintStiffness={0.3}
        triggerThreshold={1.8}
      />
    </div>
  );
}