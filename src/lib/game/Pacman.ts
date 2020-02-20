import { GameBoardItemType, KeyToGameDirection, GameDirectionMap, GameDirectionToKeys, GameDirection, pillMax } from '../Map';
import Item from './Item';

class Pacman extends Item implements GameBoardItem {

  type: GameBoardItemType = GameBoardItemType.PACMAN;

  desiredMove: string | false = false;

  score: number = 0;

  constructor(piece: GameBoardPiece, items: GameBoardItem[][], pillTimer: GameBoardItemTimer) {
    super(piece, items, pillTimer);

    // Bind context for callback events
    this.handleKeyPress = this.handleKeyPress.bind(this);

    // Add a listener for keypresses for this object
    window.addEventListener('keypress', this.handleKeyPress, false);

  }

  /**
   * Handle a keypress from the keyboard
   * 
   * @method handleKeyPress
   * @param {KeyboardEvent} e Input event
   */
  handleKeyPress(e: KeyboardEvent): void {

    if (KeyToGameDirection[e.key.toUpperCase()]) {
      this.desiredMove = KeyToGameDirection[e.key.toUpperCase()];
    }

  }

  getAdjacentItem = (location: { x: number, y: number }, direction: GameDirection) => {
    if (location.x > 0 && location.x < 15 && location.y < 15 && location.y > 0) {
      switch (direction) {
        case GameDirection.DOWN:
          return this.items[location.y + 1][location.x]
        case GameDirection.UP:
          return this.items[location.y - 1][location.x]
        case GameDirection.LEFT:
          return this.items[location.y][location.x - 1]
        case GameDirection.RIGHT:
          return this.items[location.y][location.x + 1]
      }
    }
  }

  getItemValue = (item?: GameBoardItem) => {
    if (!item) {
      return 0
    }
    switch (item.type) {
      case GameBoardItemType.GHOST:
        return -2
      case GameBoardItemType.BISCUIT:
      case GameBoardItemType.PILL:
        return 1
      case GameBoardItemType.EMPTY:
        return 0
      default:
        return -2;
    }
  }

  getAdjacentItemValue = (item?: GameBoardItem) => {
    if (!item) {
      return 0
    }
    switch (item.type) {
      case GameBoardItemType.GHOST:
        return -1
      case GameBoardItemType.BISCUIT:
      case GameBoardItemType.PILL:
        return 1
      default:
        return 0;
    }
  }

  getMoveValue = (newLoc: { x: number, y: number }, direction: GameDirection) => {
    const currentItem = this.items[newLoc.y][newLoc.x]

    const adjacentItem = this.getAdjacentItem(newLoc, direction)

    return this.getItemValue(currentItem) + this.getAdjacentItemValue(adjacentItem)
  }

  /**
   * TODO
   *    - Consider pills which are more positive (sometimes) than biscuits
   *    - Consider remaining biscuits to influence direction
   *    - Take direction of ghosts into account (they're not a threat if moving away!)
   *    - Corners! How to deal with corners?!
   */
  getBestMove(): GameBoardItemMove | boolean {
    const { moves } = this.piece;

    const x = this.piece.x
    const y = this.piece.y

    const potentialMoves: GameDirectionMap = {
      up: this.getMoveValue({ y: y - 1, x: x }, this.direction),
      right: this.getMoveValue({ y: y, x: x + 1 }, this.direction),
      left: this.getMoveValue({ y: y, x: x - 1 }, this.direction),
      down: this.getMoveValue({ y: y + 1, x: x }, this.direction),
      none: -4
    }

    const bestMove = Object.entries(potentialMoves).sort(([, v1], [, v2]) => v2 - v1)[0][0]

    if (moves[bestMove]) {
      return { piece: moves[bestMove], direction: GameDirectionMap[bestMove] }
    }

    return false
  }

  /**
   * Returns the next move from the keyboard input
   * 
   * @method getNextMove
   * @return {GameBoardItemMove | boolean} Next move
   */
  getNextMove(): GameBoardItemMove | boolean {

    const { moves } = this.piece;

    let move: GameBoardItemMove | false = false;

    // If there is a keyboard move, use it and clear it
    if (this.desiredMove) {
      if (moves[this.desiredMove]) {
        move = { piece: moves[this.desiredMove], direction: GameDirectionMap[this.desiredMove] };
        this.desiredMove = false;
      }
    }

    // Otherwise, continue in the last direction
    if (!move && this.direction !== GameDirection.NONE) {
      const key = GameDirectionToKeys(this.direction);
      if (moves[key]) {
        move = { piece: moves[key], direction: this.direction };
      }
    }

    return move;

  }

  /**
   * Move Pacman and "eat" the item
   * 
   * @method move
   * @param {GameBoardPiece} piece 
   * @param {GameDirection} direction 
   */
  move(piece: GameBoardPiece, direction: GameDirection): void {

    const item = this.items[piece.y][piece.x];
    if (typeof item !== 'undefined') {
      this.score += item.type;
      switch (item.type) {
        case GameBoardItemType.PILL:
          this.pillTimer.timer = pillMax;
          break;
        case GameBoardItemType.GHOST:
          if (typeof item.gotoTimeout !== 'undefined')
            item.gotoTimeout();
          break;
        default: break;
      }
    }
    this.setBackgroundItem({ type: GameBoardItemType.EMPTY });
    this.fillBackgroundItem();

    this.setPiece(piece, direction);
    this.items[piece.y][piece.x] = this;
  }

}

export default Pacman;