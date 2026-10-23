interface TextRollProps {
  label: string;
  center?: boolean;
}

const STAGGER_MS = 35;

function TextRoll({ label, center = true }: TextRollProps) {
  const characters = Array.from(label);
  const middle = (characters.length - 1) / 2;

  function getDelay(index: number) {
    return center ? STAGGER_MS * Math.abs(index - middle) : STAGGER_MS * index;
  }

  return (
    <span className="text-roll" aria-hidden="true">
      <span className="text-roll-line text-roll-line-primary">
        {characters.map((character, index) => (
          <span
            className="text-roll-character"
            key={`primary-${index}`}
            style={{ transitionDelay: `${getDelay(index)}ms` }}
          >
            {character}
          </span>
        ))}
      </span>
      <span className="text-roll-line text-roll-line-secondary">
        {characters.map((character, index) => (
          <span
            className="text-roll-character"
            key={`secondary-${index}`}
            style={{ transitionDelay: `${getDelay(index)}ms` }}
          >
            {character}
          </span>
        ))}
      </span>
    </span>
  );
}

export default TextRoll;
