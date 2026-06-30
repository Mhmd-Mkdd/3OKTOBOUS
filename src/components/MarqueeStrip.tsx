const items = [
  "Strategy",
  "Design",
  "Photography",
  "Video",
  "Content",
  "Marketing",
  "Web",
  "Apps",
];

/**
 * MarqueeStrip — a kinetic, edge-to-edge scrolling text band used as a
 * section divider. The row reverses direction on the odd/even copy to
 * create a layered parallax feel.
 */
export function MarqueeStrip() {
  return (
    <div className="marquee-strip" aria-hidden="true">
      <div className="marquee-strip__row">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} className="marquee-strip__item">
            {item}
            <i className="marquee-strip__star">✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}