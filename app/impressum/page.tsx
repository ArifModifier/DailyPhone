export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-10">
        Impressum
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Angaben gemäß § 5 TMG</h2>
        <p>
          Ahmad Arif<br />
          DailyPhone<br />
          Pallasstraße 25<br />
          10781 Berlin<br />
          Deutschland
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Kontakt</h2>
        <p>
          Telefon: 030 23535168<br />
          E-Mail: <a href="mailto:dailyphonestore@gmail.com" className="text-blue-600 hover:underline">dailyphonestore@gmail.com</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Umsatzsteuer-ID</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
          <strong>DE455483459</strong>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p>
          Ahmad Arif<br />
          Pallasstraße 25<br />
          10781 Berlin
        </p>
      </section>

      <section className="text-sm text-gray-600">
        <p>
          Quelle: Selbst erstellt auf Grundlage gesetzlicher Vorgaben. Für Vollständigkeit und Aktualität wird keine Gewähr übernommen.
        </p>
      </section>
    </div>
  );
}
