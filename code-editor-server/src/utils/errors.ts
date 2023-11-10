// Custom error class for unique title constraint
export class UniqueTitleError extends Error {
    constructor(message?: string) {
      super("Snippet title must be unique");
      this.name = "UniqueTitleError";
    }
  }