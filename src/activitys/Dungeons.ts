import Combatant from "../main/Combatant";
import { Language, Phrase } from "../localisation/phrases";
import { getLocalePhrase } from "../localisation/translations";
import { Flavour, Metadata } from "../main/types";
import {
  AllDungeonAndAdventuresByLevelId,
  dungeonTimersByMapId,
} from "../main/constants";
import { VideoCategory } from "../types/VideoCategory";
import { DungeonTimelineSegment, TimelineSegmentType } from "../main/dungeon";
import Activity from "./Activity";

export default class FellowshipDungeon extends Activity {
  private _level: number;

  private _timings: number[];

  private _CMDuration: number = 0;

  private _timeline: DungeonTimelineSegment[] = [];

  private affixes: number[] = [];

  constructor(
    startDate: Date,
    zoneID: number,
    level: number,
    affixes: number[],
    flavor: Flavour,
    category: VideoCategory = VideoCategory.Dungeons,
  ) {
    super(startDate, category, flavor);
    this._zoneID = zoneID;
    this._level = level;
    this.affixes = affixes;

    this._timings = dungeonTimersByMapId[zoneID];

    this.overrun = 0;
  }

  get endDate() {
    return this._endDate;
  }

  set endDate(date) {
    this._endDate = date;
  }

  get CMDuration() {
    return this._CMDuration;
  }

  set CMDuration(duration) {
    this._CMDuration = duration;
  }

  get timings() {
    return this._timings;
  }

  get timeline() {
    return this._timeline;
  }

  get level() {
    return this._level;
  }

  get zoneID() {
    return this._zoneID;
  }

  get currentSegment() {
    return this.timeline.at(-1);
  }

  get dungeonName(): string {
    if (!this.zoneID) {
      throw new Error("zoneID not set, can't get dungeon name");
    }

    const isRecognisedDungeon = Object.prototype.hasOwnProperty.call(
      AllDungeonAndAdventuresByLevelId,
      this.zoneID,
    );

    if (isRecognisedDungeon) {
      return AllDungeonAndAdventuresByLevelId[this.zoneID];
    }

    return "Unknown Dungeon";
  }

  get resultInfo() {
    if (this.result === undefined) {
      throw new Error("[RaidEncounter] Tried to get result info but no result");
    }

    const language = this.cfg.get<string>("language") as Language;

    if (this.result) {
      return getLocalePhrase(language, Phrase.Timed);
    }

    return getLocalePhrase(language, Phrase.Abandoned);
  }

  endDungeon(endDate: Date, CMDuration: number, result: boolean) {
    this.endCurrentTimelineSegment(endDate);
    const lastSegment = this.currentSegment;

    if (lastSegment && lastSegment.length() < 10000) {
      console.debug(
        "[FellowshipDungeon] Removing last timeline segment because it's too short.",
      );
      this.removeLastTimelineSegment();
    }

    this.CMDuration = CMDuration;
    super.end(endDate, result);
  }

  addTimelineSegment(segment: DungeonTimelineSegment, endPrevious?: Date) {
    if (endPrevious) {
      this.endCurrentTimelineSegment(endPrevious);
    }

    this.timeline.push(segment);
  }

  endCurrentTimelineSegment(date: Date) {
    if (this.currentSegment) {
      this.currentSegment.logEnd = date;
    }
  }

  removeLastTimelineSegment() {
    this.timeline.pop();
  }

  getLastBossEncounter(): DungeonTimelineSegment | undefined {
    if (this.flavour !== Flavour.Retail) {
      return undefined;
    }

    return this.timeline
      .slice()
      .reverse()
      .find((v) => v.segmentType === TimelineSegmentType.BossEncounter);
  }

  getMetadata(): Metadata {
    const rawCombatants = Array.from(this.combatantMap.values()).map(
      (combatant: Combatant) => combatant.getRaw(),
    );

    const rawSegments = this.timeline.map((segment: DungeonTimelineSegment) =>
      segment.getRaw()
    );

    return {
      category: this.category,
      zoneID: this.zoneID,
      duration: this.duration,
      result: this.result,
      player: this.player.getRaw(),
      challengeModeTimeline: rawSegments,
      keystoneLevel: this.level,
      flavour: this.flavour,
      overrun: this.overrun,
      combatants: rawCombatants,
      affixes: this.affixes,
      deaths: this.deaths,
      start: this.startDate.getTime(),
      uniqueHash: this.getUniqueHash(),
    };
  }

  getFileName(): string {
    let fileName = `${this.dungeonName} +${this.level} (${this.resultInfo})`;

    try {
      if (this.player.name !== undefined) {
        fileName = `${this.player.name} - ${fileName}`;
      }
    } catch {
      console.warn("[FellowshipDungeon] Failed to get player combatant");
    }

    return fileName;
  }
}
