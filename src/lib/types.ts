export type Category =
  | 'RATES'
  | 'FX'
  | 'GEOPOLITICS'
  | 'SUPPLY_CHAIN'
  | 'ENERGY'
  | 'CENTRAL_BANKS'
  | 'SOVEREIGN_DEBT'
  | 'STRUCTURAL'

export interface WhatHappenedItem {
  title: string
  category: Category
  summary: string
  mechanism: string
  signal_or_noise: 'SIGNAL' | 'NOISE'
  signal_reason: string
}

export interface MacroEnvironment {
  summary: string
  cycle_position: string
  dominant_force: string
  dollar_dynamics: string
}

export interface UnderTheSurface {
  summary: string
  what_to_watch: string
  time_horizon: string
}

export interface WatchListItem {
  item: string
  why: string
  trigger: string
}

export interface YieldCurve {
  current_shape: 'Normal' | 'Flat' | 'Inverted' | 'Steepening' | 'Flattening'
  commentary: string
}

export interface Brief {
  headline: string
  macro_environment: MacroEnvironment
  what_happened: WhatHappenedItem[]
  under_the_surface: UnderTheSurface
  watch_list: WatchListItem[]
  yield_curve: YieldCurve
  one_line_summary: string
}

export interface BriefRow {
  id: number
  created_at: Date
  date: string
  headline: string
  macro_environment: MacroEnvironment
  what_happened: WhatHappenedItem[]
  under_the_surface: UnderTheSurface
  watch_list: WatchListItem[]
  raw_json: Brief
}

export interface DrillDownRequest {
  sectionKey: string
  sectionContent: unknown
  briefDate: string
}

export interface ArchiveSummary {
  date: string
  headline: string
}
