/**
 * Class that represents a position in a grid
 */
export class Position
{
    constructor(public x: number, public y: number) {}

    public equals(anotherPosition: Position): boolean {
        return anotherPosition.x == this.x && anotherPosition.y == this.y;
    }
}
