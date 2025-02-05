export class Slug {
  public value: string

  constructor(value: string) {
    this.value = value
  }

  /**
   * Recieves a string and normalize it as a slug.
   *
   * Example: "An esample title" => "an-example-title"
   *
   * @param text {string}
   */

  static createFromText(text: string) {
    const slugText = text
      .normalize("NFKD")
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/_/g, "-")
      .replace(/--+/g, "-")
      .replace(/-$/g, "")

    return new Slug(slugText)
  }
}
