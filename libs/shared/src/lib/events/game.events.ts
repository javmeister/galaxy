

import { Galaxy, Planet, Sector, SolarSystem } from "../models";
import { ObjectData } from "../types/galaxy-data.interface";
import { BaseEvent, BaseReplayEvent } from "./base.event";

// Basic type events
export class OnNumberEvent extends BaseEvent<number> { name = 'OnNumberEvent'; };
export class OnStringEvent extends BaseEvent<string> { name = 'OnStringEvent'; };
export class OnBooleanEvent extends BaseEvent<boolean> { name = 'OnBooleanEvent'; };

// Data Events
export class OnGalaxyModelReadyEvent extends BaseReplayEvent<Galaxy> { name = 'OnGalaxyModelReadyEvent'; };
export class OnDataLoadedEvent extends BaseReplayEvent<{sectors: Sector[], systems: SolarSystem[], planets: Planet[], pois: any[] }>{ name = 'OnDataLoadedEvent'; };
export class OnPlayerClaimedSectorsLoadedEvent extends BaseReplayEvent{ name = 'OnPlayerClaimedSectorsLoadedEvent'; };
export class OnPlayerClaimedSolarSystemsLoadedEvent extends BaseReplayEvent{ name = 'OnPlayerClaimedSolarSystemsLoadedEvent'; };

export class OnMintedSolarSystemsLoadedEvent extends BaseReplayEvent{ name = 'OnMintedSolarSystemsLoadedEvent'; };
export class OnMintedAvailableSolarSystemsLoadedEvent extends BaseReplayEvent{ name = 'OnMintedAvailableSolarSystemsLoadedEvent'; };

// Game State Events
export class OnScenesReadyEvent extends BaseReplayEvent{ name = 'OnScenesReadyEvent'; };
export class OnLoadingScreenFadedOutEvent extends BaseReplayEvent{ name = 'OnLoadingScreenFadedOutEvent'; };
export class OnGameStartedEvent extends BaseReplayEvent{ name = 'OnGameStartedEvent'; };


// Galaxy View Events
export class OnGalaxyCalloutClickEvent extends BaseEvent<ObjectData>{ name = 'OnGalaxyCalloutClickEvent'; };
export class OnGalaxyCalloutToggleEvent extends BaseEvent{ name = 'OnGalaxyCalloutToggleEvent'; };
export class OnGalaxySectorClickEvent extends BaseEvent<{ id: number, x: number, y: number}>{ name = 'OnGalaxySectorClickEvent'; };

export class OnSectorSelectedEvent extends BaseReplayEvent<Sector>{ name = 'OnSectorSelectedEvent'; };
export class OnSectorDeselectedEvent extends BaseEvent{ name = 'OnSectorDeselectedEvent'; };

// Sector View Events
// TODO: Do OnBeforeSeleced OnAfterSelected instead of this mess
export class OnClickSolarSystemEvent extends BaseEvent<SolarSystem>{ name = 'OnClickSolarSystemEvent'; };
export class OnSelectSolarSystemEvent extends BaseEvent<SolarSystem>{ name = 'OnSelectSolarSystemEvent'; };
export class OnSolarSystemSelectedEvent extends BaseReplayEvent<SolarSystem>{ name = 'OnSolarSystemSelectedEvent'; };
export class OnSolarSystemDeselectedEvent extends BaseEvent{ name = 'OnSolarSystemDeselectedEvent'; };
export class OnGalaxyClickEvent extends BaseEvent{ name = 'OnGalaxyClickEvent'; };
export class OnGoBackToGalaxyEvent extends BaseEvent{ name = 'OnGoBackToGalaxyEvent'; };

// Intro Events
export class OnIntroAlreadyCompletedEvent extends BaseEvent{ name = 'OnIntroAlreadyCompletedEvent'; };
export class OnIntroArgosCalloutClickEvent extends BaseEvent{ name = 'OnIntroArgosCalloutClickEvent'; };
export class OnIntroBackToGalaxyViewEvent extends BaseEvent{ name = 'OnIntroBackToGalaxyViewEvent'; };
export class OnIntroCompleteEvent extends BaseEvent{ name = 'OnIntroCompleteEvent'; };
export class OnIntroCompleteSaveEvent extends BaseEvent{ name = 'OnIntroCompleteSaveEvent'; };
export class OnIntroPlaySequenceEvent extends BaseReplayEvent{ name = 'OnIntroPlaySequenceEvent'; };
export class OnIntroSequenceStepEndEvent extends BaseEvent{ name = 'OnIntroSequenceStepEndEvent'; };
export class OnIntroSequenceStepStartEvent extends BaseEvent{ name = 'OnIntroSequenceStepStartEvent'; };
export class OnIntroShowAllCalloutsEvent extends BaseEvent{ name = 'OnIntroShowAllCalloutsEvent'; };
export class OnIntroShowArgosCalloutEvent extends BaseEvent{ name = 'OnIntroShowArgosCalloutEvent'; };
export class OnIntroShowSaulCalloutEvent extends BaseEvent{ name = 'OnIntroShowSaulCalloutEvent'; };
export class OnIntroShowSystemReticleEvent extends BaseEvent{ name = 'OnIntroShowSystemReticleEvent'; };
export class OnIntroStartEvent extends BaseReplayEvent{ name = 'OnIntroStartEvent'; };
export class OnIntroSystemReticleClickEvent extends BaseEvent{ name = 'OnIntroSystemReticleClickEvent'; };

// UI Events
export class OnShowHeadlineEvent extends BaseEvent<{ text: string, duration: number }>{ name = 'OnShowHeadlineEvent'; };
export class OnShowSocialIconsEvent extends BaseEvent{ name = 'OnShowSocialIconsEvent'; };
export class OnShowActionButtonsEvent extends BaseReplayEvent{ name = 'OnShowActionButtonsEvent'; };
export class OnShowVersionNumberEvent extends BaseEvent{ name = 'OnShowVersionNumberEvent'; };
export class OnShowGalaxyStatsEvent extends BaseEvent{ name = 'OnShowGalaxyStatsEvent'; };
export class OnShowSectorStatsEvent extends BaseEvent{ name = 'OnShowSectorStatsEvent'; };
