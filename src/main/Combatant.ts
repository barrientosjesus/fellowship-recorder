import { RawCombatant } from "./types";

/**
 * Represents an arena combatant.
 */
export default class Combatant {
  private _GUID: string;

  private _heroID?: number;

  private _name?: string;

  private _realm?: string;

  private _region?: string;

  private _isPlayer?: boolean;

  private _teamID?: number;

  /**
   * Constructs a new Combatant.
   *
   * @param GUID the GUID of the combatant.
   * @param heroID the heroID of the combatant
   */
  constructor(
    GUID: string,
    name?: string,
    heroID?: number,
    isPlayer?: boolean,
    teamID?: number,
  ) {
    this._GUID = GUID;
    this._name = name;

    if (heroID !== undefined) {
      this._heroID = heroID;
    }

    if (isPlayer !== undefined) {
      this._isPlayer = isPlayer;
    }

    if (teamID !== undefined) {
      this._teamID = teamID;
    }
  }

  /**
   * Gets the GUID.
   */
  get GUID() {
    return this._GUID;
  }

  /**
   * Sets the GUID.
   */
  set GUID(value) {
    this._GUID = value;
  }

  /**
   * Gets the isPlayer.
   */
  get isPlayer() {
    return this._isPlayer;
  }

  /**
   * Sets the isPlayer.
   */
  set isPlayer(value) {
    this._isPlayer = value;
  }

  /**
   * Gets the hero ID.
   */
  get heroID() {
    return this._heroID;
  }

  /**
   * Sets the heroID.
   */
  set heroID(value) {
    this._heroID = value;
  }

  /**
   * Gets the name.
   * @apinote Name is in Name-Realm format
   */
  get name() {
    return this._name;
  }

  /**
   * Sets the name.
   * @apinote Name is in Name-Realm format
   */
  set name(value) {
    this._name = value;
  }

  /**
   * Gets the name.
   * @apinote Name is in Name-Realm format
   */
  get realm() {
    return this._realm;
  }

  /**
   * Gets the team ID.
   */
  get teamID() {
    return this._teamID;
  }

  /**
   * Sets the team ID.
   */
  set teamID(value) {
    this._teamID = value;
  }

  /**
   * Gets the region.
   */
  get region() {
    return this._region;
  }

  /**
   * Sets the region.
   */
  set region(value) {
    this._region = value;
  }

  isFullyDefined() {
    const hasGUID = this.GUID !== undefined;
    const hasName = this.name !== undefined;
    const hasRealm = this.realm !== undefined;
    const hasHeroID = this.heroID !== undefined;
    const hasIsPlayer = this.isPlayer !== undefined;
    const hasTeamID = this.teamID !== undefined;

    // We do not check region here, because it may not exists in Classic / Era clients.
    return hasGUID && hasName && hasRealm && hasHeroID && hasIsPlayer && hasTeamID;
  }

  getRaw(): RawCombatant {
    const rawCombatant: RawCombatant = { _GUID: this.GUID };

    if (this.heroID !== undefined) rawCombatant._heroID = this.heroID;
    if (this.name !== undefined) rawCombatant._name = this.name;
    if (this.region !== undefined) rawCombatant._region = this.region;
    if (this.isPlayer !== undefined) rawCombatant._isPlayer = this.isPlayer;
    if (this.teamID !== undefined) rawCombatant._teamID = this.teamID;

    return rawCombatant;
  }
}
