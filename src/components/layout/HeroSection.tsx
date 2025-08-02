export default function HeroSection() {
  return (
    <div className="max-w-4xl mx-auto text-center py-12 px-6">
      <h1
        className="c3-heading c3-heading-lg mb-6"
        style={{ color: "var(--c3-text-primary)" }}
      >
        JOIN A CONNECT GROUP
      </h1>

      <div
        className="c3-text-body mb-8 max-w-2xl mx-auto"
        style={{ color: "var(--c3-text-secondary)" }}
      >
        <p>
          At C3 Toronto, Connect Groups play a vital role in creating community,
          growing our faith, and connecting people to God. Our groups run on a
          semester basis, with the next season starting June 3rd!
        </p>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm" style={{ color: 'var(--c3-text-secondary)' }}>
          <div>
            <span className="font-medium">Fall:</span> September - November
          </div>
          <div>
            <span className="font-medium">Winter:</span> February - April
          </div>
          <div>
            <span className="font-medium">Summer:</span> June - July
          </div>
        </div> */}
    </div>
  );
}
