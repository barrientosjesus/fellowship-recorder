import Combatant from "../main/Combatant";

import {
  AllDungeonAndAdventuresByLevelId,
  AllDungeonAndAdventureTimersByLevelId,
  currentRetailEncounters,
  dungeonEncounters,
  dungeonTimersByMapId,
  instanceDifficulty,
  AdventuresByLevelID,
  DungeonsByLevelID,
} from "../main/constants";

import LogHandler from "./LogHandler";
import ChallengeModeDungeon from "../activitys/ChallengeModeDungeon";

import {
  ChallengeModeTimelineSegment,
  TimelineSegmentType,
} from "../main/keystone";

import { Flavour } from "../main/types";
import LogLine from "./LogLine";
import { VideoCategory } from "../types/VideoCategory";
import ConfigService from "config/ConfigService";
import FellowshipDungeon from "activitys/Dungeons";
import { DungeonTimelineSegment } from "main/dungeon";

/**
 * FellowshipLogHandler class.
 */
export default class FellowshipLogHandler extends LogHandler {
  private isPtr = false;

  constructor(logPath: string) {
    super(logPath, 10);

    this.combatLogWatcher
      .on("DUNGEON_START", async (line: LogLine) => {
        await this.handleDungeonStartLine(line);
      })
      .on("DUNGEON_END", async (line: LogLine) => {
        await this.handleDungeonEndLine(line);
      })
      .on("ENCOUNTER_START", async (line: LogLine) => {
        await this.handleEncounterStartLine(line);
      })
      .on("ENCOUNTER_END", async (line: LogLine) => {
        await this.handleEncounterEndLine(line);
      })
      .on("UNIT_DEATH", (line: LogLine) => {
        this.handleUnitDiedLine(line);
      })
      .on("ALLY_DEATH", (line: LogLine) => {
        this.handleUnitDiedLine(line);
      })
      .on("UNIT_DESTROYED", (line: LogLine) => {
        this.handleUnitDiedLine(line);
      })
      .on("COMBATANT_INFO", (line: LogLine) => {
        this.handleCombatantInfoLine(line);
      })
      .on("ZONE_CHANGE", (line: LogLine) => {
        this.handleZoneChangeLine(line);
      });
  }

  public setIsPtr() {
    this.isPtr = true;
  }

  private async handleZoneChangeLine(line: LogLine) {
    console.debug("[FellowshipLogHandler] Handling ZONE_CHANGE line:", line);

    if (!LogHandler.activity) {
      console.error("[FellowshipLogHandler] No active activity on zone change");
      return;
    }

    await LogHandler.forceEndActivity();
  }

  private async handleDungeonStartLine(line: LogLine) {
    console.debug("[FellowshipLogHandler] Handling DUNGEON_START line:", line);

    if (
      LogHandler.activity &&
      (LogHandler.activity.category === VideoCategory.Dungeons ||
        LogHandler.activity.category === VideoCategory.Adventures ||
        LogHandler.activity.category === VideoCategory.Quickplays)
    ) {
      // This can happen if you zone in and out of a key mid pull.
      // If it's a new key, we see a CHALLENGE_MODE_END event first.
      console.info("[FellowshipLogHandler] Subsequent start event for dungeon");
      return;
    }
    const zoneID = line.arg(2) as number;

    const unknownMap = !Object.prototype.hasOwnProperty.call(
      AllDungeonAndAdventuresByLevelId,
      zoneID,
    );

    if (unknownMap) {
      console.error("[FellowshipLogHandler] Unknown map", zoneID);
      return;
    }

    const unknownTimer = !Object.prototype.hasOwnProperty.call(
      AllDungeonAndAdventureTimersByLevelId,
      zoneID,
    );

    if (unknownTimer) {
      console.error("[FellowshipLogHandler] Unknown timer", zoneID);
      return;
    }

    const startTime = line.date();
    const level = line.arg(3) as number;
    const affixes = line.arg(4) as number[];
    const isQuickplay = Boolean(line.arg(5) as number);
    const minLevelToRecord = ConfigService.getInstance().get<number>(
      "minKeystoneLevel",
    );

    if (!isQuickplay && level < minLevelToRecord) {
      console.info(
        "[FellowshipLogHandler] Ignoring difficulty below recording threshold",
      );
      return;
    }

    const recordQuickplay = ConfigService.getInstance().get<boolean>(
      "recordQuickplays",
    );

    if (isQuickplay && !recordQuickplay) {
      console.info("[FellowshipLogHandler] Ignoring quickplay");
      return;
    }

    const isAdventure = Object.prototype.hasOwnProperty.call(
      AdventuresByLevelID,
      zoneID,
    );
    
    const isDungeon = Object.prototype.hasOwnProperty.call(
      DungeonsByLevelID,
      zoneID,
    );

    const category = isQuickplay
      ? VideoCategory.Quickplays
      : isAdventure
      ? VideoCategory.Adventures
      : VideoCategory.Dungeons;

    const activity = new FellowshipDungeon(
      startTime,
      zoneID,
      level,
      affixes,
      Flavour.Retail,
      category,
    );

    const initialSegment = new DungeonTimelineSegment(
      TimelineSegmentType.Trash,
      activity.startDate,
      0,
    );

    activity.addTimelineSegment(initialSegment);
    await LogHandler.startActivity(activity);
  }

  private async handleDungeonEndLine(line: LogLine) {
    console.debug("[FellowshipLogHandler] Handling DUNGEON_END line:", line);

    if (!LogHandler.activity) {
      console.error(
        "[FellowshipLogHandler] Challenge mode stop with no active Fellowship Dungeon",
      );
      return;
    }

    const fellowshipDungeonActivity = LogHandler.activity as FellowshipDungeon;
    const endDate = line.date();

    // Need to convert to int here as "0" evaluates to truthy.
    const result = Boolean(line.arg(5) as number);

    // The actual log duration of the dungeon, from which keystone upgrade
    // levels can be calculated. This includes player death penalty.
    const dungeonDuration = Math.round((line.arg(6) as number) / 1000);

    if (result) {
      const overrun = ConfigService.getInstance().get<number>("dungeonOverrun");
      fellowshipDungeonActivity.overrun = overrun;
    }

    fellowshipDungeonActivity.endDungeon(endDate, dungeonDuration, result);
    await LogHandler.endActivity();
  }

  protected async handleEncounterStartLine(line: LogLine) {
    console.debug(
      "[FellowshipLogHandler] Handling ENCOUNTER_START line:",
      line,
    );
    const encounterID = line.arg(1) as number;

    if (!LogHandler.activity) {
      const knownDungeonEncounter = Object.prototype.hasOwnProperty.call(
        dungeonEncounters,
        encounterID,
      );

      if (knownDungeonEncounter) {
        // We can hit this branch due to a few cases:
        //   - It's a regular dungeon, we don't record those
        //   - It's a M+ below the recording threshold
        console.info(
          "[FellowshipLogHandler] Known dungeon encounter and not in M+, not recording",
        );

        return;
      }

      const currentRaidOnly = ConfigService.getInstance().get<boolean>(
        "recordCurrentRaidEncountersOnly",
      );

      if (
        !this.isPtr &&
        currentRaidOnly &&
        !currentRetailEncounters.includes(encounterID)
      ) {
        console.warn("[FellowshipLogHandler] Not a current encounter");
        return;
      }

      const logDifficultyID = line.arg(3) as number;
      const { difficultyID } = instanceDifficulty[logDifficultyID];
      const orderedDifficulty = ["lfr", "normal", "heroic", "mythic"];

      const minDifficultyToRecord = ConfigService.getInstance()
        .get<string>("minRaidDifficulty")
        .toLowerCase();

      const actualIndex = orderedDifficulty.indexOf(difficultyID);
      const configuredIndex = orderedDifficulty.indexOf(minDifficultyToRecord);

      if (actualIndex < configuredIndex) {
        console.info(
          "[FellowshipLogHandler] Not recording as threshold not met by",
          actualIndex,
          configuredIndex,
        );
        return;
      }

      await super.handleEncounterStartLine(line, Flavour.Retail);
      return;
    }

    const { category } = LogHandler.activity;
    const isFellowshipDungeon = category === VideoCategory.Dungeons ||
      category === VideoCategory.Adventures ||
      category === VideoCategory.Quickplays;

    if (!isFellowshipDungeon) {
      console.error(
        "[FellowshipLogHandler] Encounter is already in progress and not a ChallengeMode",
      );
      return;
    }

    const activeFellowshipDungeon = LogHandler.activity as FellowshipDungeon;
    const eventDate = line.date();
    const encounterNames = line.arg(2) as string[];

    const segment = new DungeonTimelineSegment(
      TimelineSegmentType.BossEncounter,
      eventDate,
      this.getRelativeTimestampForTimelineSegment(eventDate),
      encounterID,
      encounterNames,
    );

    activeFellowshipDungeon.addTimelineSegment(segment, eventDate);
    console.debug(
      `[FellowshipLogHandler] Starting new boss encounter: ${
        dungeonEncounters[encounterID]
      }`,
    );
  }

  protected async handleEncounterEndLine(line: LogLine) {
    console.debug("[FellowshipLogHandler] Handling ENCOUNTER_END line:", line);

    if (!LogHandler.activity) {
      console.error(
        "[FellowshipLogHandler] Encounter end event spotted but not in activity",
      );

      return;
    }

    const { category } = LogHandler.activity;
    const isFellowshipDungeon = category === VideoCategory.Dungeons ||
      category === VideoCategory.Adventures ||
      category === VideoCategory.Quickplays;

    if (!isFellowshipDungeon) {
      console.debug(
        "[FellowshipLogHandler] Must be raid encounter, calling super method.",
      );
      await super.handleEncounterEndLine(line);
    } else {
      console.debug("[FellowshipLogHandler] Dungeon encounter.");
      const activeDungeon = LogHandler.activity as FellowshipDungeon;
      const eventDate = line.date();
      const result = Boolean(line.arg(3) as number);
      const encounterID = line.arg(1) as number;
      const encounterNames = line.arg(2) as string[];
      const { currentSegment } = activeDungeon;

      if (currentSegment) {
        currentSegment.result = result;
      }

      const segment = new DungeonTimelineSegment(
        TimelineSegmentType.Trash,
        eventDate,
        this.getRelativeTimestampForTimelineSegment(eventDate),
      );

      // Add a trash segment as the boss encounter ended
      activeDungeon.addTimelineSegment(segment, eventDate);
      console.debug(
        `[FellowshipLogHandler] Ending dungeon encounter: ${
          encounterNames.join(", ")
        }`,
      );
    }
  }

  private handleCombatantInfoLine(line: LogLine): void {
    if (!LogHandler.activity) {
      console.warn(
        "[FellowshipLogHandler] No activity in progress, ignoring COMBATANT_INFO",
      );
      return;
    }

    const GUID = line.arg(2) as string;

    // In Mythic+ we see COMBANTANT_INFO events for each encounter.
    // Don't bother overwriting them if we have them already.
    const combatant = LogHandler.activity.getCombatant(GUID);

    if (combatant && combatant.isFullyDefined()) {
      return;
    }
    const name = line.arg(3) as string;
    const isPlayerFlag = Boolean(line.arg(4) as number);
    const heroID = line.arg(5) as number;

    console.info(
      "[FellowshipLogHandler] Adding combatant from COMBATANT_INFO",
      GUID,
      isPlayerFlag,
      heroID,
    );

    const newCombatant = new Combatant(GUID, name, heroID, isPlayerFlag);

    if (newCombatant.isFullyDefined() || isPlayerFlag) {
      LogHandler.activity.playerGUID = GUID;
    }

    LogHandler.activity.addCombatant(newCombatant);
  }

  private getRelativeTimestampForTimelineSegment(eventDate: Date) {
    if (!LogHandler.activity) {
      console.error(
        "[FellowshipLogHandler] getRelativeTimestampForTimelineSegment called but no active activity",
      );

      return 0;
    }

    const activityStartDate = LogHandler.activity.startDate;
    const relativeTime = (eventDate.getTime() - activityStartDate.getTime()) /
      1000;
    return relativeTime;
  }
}
