export class PokemonCard{
    constructor(id, name, originalPriceInDollars, percentOff, numberInStock, dateAdded)
    {
        this.id = id;
        this.name = name;
        this.originalPriceInDollars = originalPriceInDollars;
        this.percentOff = percentOff;
        this.numberInStock = numberInStock;
        this.dateAdded = dateAdded;
    }
}