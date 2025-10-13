export class PatternsConst {
    static readonly URL = /^https?:\/\/[^\s\/$.?#].[^\s]*$/i;
    static readonly SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    static readonly EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
}
