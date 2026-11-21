'use client';

import React, {
    useCallback,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { formatDisplayTime, parseWeddingDate } from '@/lib/format-date';
import type { WebsiteTemplateProps } from '../types';
import { WebsiteTemplateFonts } from '../shared/fonts';
import { cleanText, useWeddingTemplateData } from '../shared/useWeddingTemplateData';
import './dastak.css';

/* ============================================================================
   Asset Paths & Exact CSS Module Maps (Shagun Studio — Dastak 100% Replica)
   ============================================================================ */

const OPENING_BASE = '/website-templates/royal-heritage/dastak/opening';
/** Landing (hero) background: 16:9 for landscape screens, 9:16 for portrait. */
const HERO_BASE = '/website-templates/royal-heritage/hero';
const HERO_PORTRAIT_QUERY = '(max-aspect-ratio: 1/1)';
const ART_BASE = '/website-templates/royal-heritage/dastak/art';
const GALLERY_BASE = '/website-templates/royal-heritage/dastak/gallery';
const DEFAULT_DASTAK_AUDIO = '/website-templates/royal-heritage/dastak/dastak-audio.mp3';

const R: Record<string, string> = {
    site: 'styles_site___XVVD',
    overlays: 'styles_overlays__zO_T2',
    revealMark: 'styles_revealMark__Mx_t1',
    ambient: 'styles_ambient__bkCfE',
    ambientField: 'styles_ambientField__r5u9o',
    hero: 'styles_hero__mEBhK',
    heroStage: 'styles_heroStage__tiq4o',
    heroMedia: 'styles_heroMedia__tyDxW',
    heroVeil: 'styles_heroVeil__4UMTU',
    heroCopy: 'styles_heroCopy__9c06h',
    line: 'styles_line__DMcOt',
    invocationEmblem: 'styles_invocationEmblem__70tZ_',
    invocationText: 'styles_invocationText__hkSqv',
    eyebrow: 'styles_eyebrow__zjyjw',
    divider: 'styles_divider__OBWHU',
    names: 'styles_names__Fpdrg',
    name: 'styles_name__LKbrC',
    heroDate: 'styles_heroDate__TPAVL',
    heroPlace: 'styles_heroPlace__tJsLc',
    heroPoem: 'styles_heroPoem__Tof1j',
    invocationLine: 'styles_invocationLine__eKsrz',
    invocationTextCompact: 'styles_invocationTextCompact__sEGu6',
    amp: 'styles_amp__kPgG0',
    scrollHint: 'styles_scrollHint__8FpP5',
    dkScrollPulse: 'styles_dkScrollPulse__gCJew',
    section: 'styles_section__VeRzQ',
    diamond: 'styles_diamond__EbsQE',
    deva: 'styles_deva__RYQEU',
    eyebrowDark: 'styles_eyebrowDark__am_sm',
    heading: 'styles_heading__cGDaX',
    card: 'styles_card__6CWhz',
    inviteText: 'styles_inviteText__rvEO7',
    muhuratSection: 'styles_muhuratSection__lpC61',
    muhuratLatin: 'styles_muhuratLatin__Rrgti',
    rgBand: 'styles_rgBand__TDX56',
    rgStage: 'styles_rgStage__Wb74i',
    rgFloor: 'styles_rgFloor__1F_Cz',
    rgSheen: 'styles_rgSheen__1_1df',
    rgPlaque: 'styles_rgPlaque__xHdPN',
    rgWeekday: 'styles_rgWeekday__4eS5P',
    rgDay: 'styles_rgDay__55nbK',
    rgMonth: 'styles_rgMonth__ZuQ_T',
    rgShimmer: 'styles_rgShimmer__R0nET',
    dkRangoliShimmer: 'styles_dkRangoliShimmer__Ttw_0',
    rgRing: 'styles_rgRing__2Gv9d',
    dkRangoliSettle: 'styles_dkRangoliSettle__wK8Ih',
    rgDrift: 'styles_rgDrift__HXt4h',
    dkRangoliDrift: 'styles_dkRangoliDrift__btmOb',
    rgCanvas: 'styles_rgCanvas__m_QFX',
    rgDiya: 'styles_rgDiya__xenSi',
    rgDiyaLeft: 'styles_rgDiyaLeft__NwLlk',
    rgDiyaRight: 'styles_rgDiyaRight__xnB7C',
    rgDiyaGlow: 'styles_rgDiyaGlow__SN36C',
    dkFlicker: 'styles_dkFlicker__DA7JM',
    rgCue: 'styles_rgCue__JG8_E',
    rgCueInner: 'styles_rgCueInner__7BCtf',
    rgHint: 'styles_rgHint__qUm3N',
    rgSweepBtn: 'styles_rgSweepBtn__wspj6',
    countdownSection: 'styles_countdownSection__CsaNC',
    cdBand: 'styles_cdBand__3GPr4',
    cdHeadWrap: 'styles_cdHeadWrap__0RMCB',
    cdHead: 'styles_cdHead__LEeDN',
    cdLatin: 'styles_cdLatin__zW5xt',
    cdStage: 'styles_cdStage__en9QH',
    cdWallWrap: 'styles_cdWallWrap__FdZP_',
    cdWall: 'styles_cdWall__QzFuS',
    cdToranWrap: 'styles_cdToranWrap__vth5R',
    dkToranSway: 'styles_dkToranSway__7rcCV',
    cdToran: 'styles_cdToran__PEf2H',
    cdRow: 'styles_cdRow__ryf6F',
    cdCell: 'styles_cdCell__r_OFR',
    cdCellInner: 'styles_cdCellInner__lDjOL',
    cdHang: 'styles_cdHang__XGSTV',
    dkCdSwing: 'styles_dkCdSwing__FBAW0',
    cdDisc: 'styles_cdDisc__mLYWv',
    cdSheen: 'styles_cdSheen__6J80c',
    cdDigits: 'styles_cdDigits__CVxHU',
    cdNumber: 'styles_cdNumber__X_ejH',
    cdLabel: 'styles_cdLabel__qNJYp',
    cdBellWrap: 'styles_cdBellWrap__yvzZq',
    dkCdBellSway: 'styles_dkCdBellSway__mLKH6',
    cdBell: 'styles_cdBell__BlsmR',
    dkCdRingA: 'styles_dkCdRingA__alkpW',
    dkCdRingB: 'styles_dkCdRingB__72o2p',
    cdDiya: 'styles_cdDiya__8mJ5u',
    cdDiyaRight: 'styles_cdDiyaRight__FD0v1',
    cdDiyaArt: 'styles_cdDiyaArt__1rdPn',
    cdDiyaGlow: 'styles_cdDiyaGlow__KpkK9',
    cdPetal: 'styles_cdPetal__GWzyA',
    dkCdPetalDrift: 'styles_dkCdPetalDrift__5p3nR',
    cdPetal1: 'styles_cdPetal1__Nk6JD',
    cdPetal2: 'styles_cdPetal2__aV205',
    cdPetal3: 'styles_cdPetal3__kNzaN',
    familySection: 'styles_familySection__L2V9c',
    familyGrid: 'styles_familyGrid__eEJsZ',
    familyCard: 'styles_familyCard__tKZmk',
    grandparents: 'styles_grandparents__1RhCB',
    blessing: 'styles_blessing__StGJD',
    eventsSection: 'styles_eventsSection__LOtsE',
    events: 'styles_events__VcmPy',
    doorway: 'styles_doorway__sylum',
    toranWrap: 'styles_toranWrap__mcQjf',
    toran: 'styles_toran__P3Lg4',
    stage: 'styles_stage__RAyVu',
    aperture: 'styles_aperture__9Dlcc',
    alcove: 'styles_alcove__5iZ6q',
    alcoveGlow: 'styles_alcoveGlow___lDG4',
    dkAlcoveBreath: 'styles_dkAlcoveBreath__lJevG',
    alcoveName: 'styles_alcoveName__m0ATd',
    leaves: 'styles_leaves__PaJUk',
    leaf: 'styles_leaf__9_Fo_',
    leafLeft: 'styles_leafLeft__HoI_0',
    leafRight: 'styles_leafRight__MScBa',
    leafArt: 'styles_leafArt__KkEKj',
    leafShade: 'styles_leafShade__DGHer',
    arch: 'styles_arch__r6Get',
    diya: 'styles_diya__R_5I9',
    diyaLeft: 'styles_diyaLeft__PdwWJ',
    diyaRight: 'styles_diyaRight__WzbEI',
    diyaArt: 'styles_diyaArt__2tsgr',
    diyaGlow: 'styles_diyaGlow__o34VD',
    knock: 'styles_knock___IVR7',
    cardClip: 'styles_cardClip__q2U3c',
    eventCard: 'styles_eventCard__tzUtz',
    eventPaper: 'styles_eventPaper__r2KvL',
    eventPetal: 'styles_eventPetal__aYLOh',
    eventCardInner: 'styles_eventCardInner__DEL6U',
    dkAlcoveName: 'styles_dkAlcoveName__EM6mo',
    eventName: 'styles_eventName__oM92y',
    eventRule: 'styles_eventRule__HuBuJ',
    eventMeta: 'styles_eventMeta____R1t',
    eventVenue: 'styles_eventVenue__Edcie',
    eventDesc: 'styles_eventDesc__u_0HF',
    eventDress: 'styles_eventDress__xX9bU',
    eventDressLabel: 'styles_eventDressLabel__qQCYO',
    eventDressList: 'styles_eventDressList__OxtEe',
    eventDressChip: 'styles_eventDressChip__kIhx8',
    eventDressDot: 'styles_eventDressDot__9ivM3',
    eventDressName: 'styles_eventDressName__tWOo0',
    eventActions: 'styles_eventActions__bbpNO',
    storySection: 'styles_storySection__t1A3G',
    storyText: 'styles_storyText__yi67y',
    storyTags: 'styles_storyTags__q4x8k',
    storyTag: 'styles_storyTag__fHLTc',
    storyHashtag: 'styles_storyHashtag__oJ8yH',
    jWall: 'styles_jWall__qrnGP',
    jWallInner: 'styles_jWallInner__CAx0O',
    jharokha: 'styles_jharokha__DTBYp',
    jStage: 'styles_jStage__RoCDy',
    jGarland: 'styles_jGarland__VgFzG',
    dkGarlandSway: 'styles_dkGarlandSway__a2NP5',
    dkGarlandWhip: 'styles_dkGarlandWhip__p4wlX',
    jAperture: 'styles_jAperture__qC732',
    jPhoto: 'styles_jPhoto__9_tid',
    dkPhotoDrift: 'styles_dkPhotoDrift__LYJ_9',
    jEmpty: 'styles_jEmpty__6sj_W',
    jGlow: 'styles_jGlow__Ofve9',
    dkJharokhaBreath: 'styles_dkJharokhaBreath__NMRDX',
    jShutters: 'styles_jShutters__RmKwW',
    jShutter: 'styles_jShutter__1B6ah',
    jShutterLeft: 'styles_jShutterLeft__mYTZE',
    jShutterRight: 'styles_jShutterRight__Eq5BJ',
    jShutterArt: 'styles_jShutterArt__O1hJc',
    jShutterShade: 'styles_jShutterShade__J_l8y',
    jFrame: 'styles_jFrame__f3mtY',
    jDiya: 'styles_jDiya__WS2lJ',
    jDiyaLeft: 'styles_jDiyaLeft__Q7rMQ',
    jDiyaRight: 'styles_jDiyaRight__iITTG',
    jDiyaArt: 'styles_jDiyaArt__V3IiQ',
    jDiyaGlow: 'styles_jDiyaGlow__hB69J',
    jTap: 'styles_jTap__Jvl6L',
    jLightbox: 'styles_jLightbox__ASuhQ',
    dkLightIn: 'styles_dkLightIn__R_Hmr',
    jLightScrim: 'styles_jLightScrim__oq7fk',
    jLightPhoto: 'styles_jLightPhoto__CDH0s',
    jLightClose: 'styles_jLightClose__cjkF7',
    hashtagSection: 'styles_hashtagSection__5h1pJ',
    hashtag: 'styles_hashtag__zTkFW',
    venueSection: 'styles_venueSection__1l5tN',
    venueAddr: 'styles_venueAddr__AyI1p',
    venueActions: 'styles_venueActions__HVNu0',
    copyBtn: 'styles_copyBtn__NBrIT',
    infoGrid: 'styles_infoGrid___kZ1b',
    infoCard: 'styles_infoCard__adP4G',
    infoHead: 'styles_infoHead__dqGHH',
    infoMaps: 'styles_infoMaps__rjDKx',
    concierge: 'styles_concierge__TW9Fg',
    rsvpSection: 'styles_rsvpSection__6r66q',
    chitthiBand: 'styles_chitthiBand__e3HaN',
    chitthiWrap: 'styles_chitthiWrap__qpF4k',
    chitthiPetal: 'styles_chitthiPetal__gSHs4',
    chitthiPetalA: 'styles_chitthiPetalA__0Dbtz',
    chitthiPetalB: 'styles_chitthiPetalB__iHToI',
    chitthi: 'styles_chitthi__vv4T0',
    chitthiPaper: 'styles_chitthiPaper__uAC8F',
    chitthiFlourish: 'styles_chitthiFlourish__5y2tr',
    chitthiInk: 'styles_chitthiInk__LoR5V',
    rsvpIntro: 'styles_rsvpIntro__4hiw3',
    rsvpCta: 'styles_rsvpCta__leyTo',
    chitthiMarigold: 'styles_chitthiMarigold__DHFHJ',
    dkChitthiDrop: 'styles_dkChitthiDrop__zz6Vo',
    finale: 'styles_finale__jIQCG',
    finaleDiamond: 'styles_finaleDiamond__SSi9k',
    finaleMono: 'styles_finaleMono__m4hoo',
    monoDot: 'styles_monoDot__YP32s',
    finaleCopy: 'styles_finaleCopy__4zRkW',
    finaleCtas: 'styles_finaleCtas__botaE',
    finaleNames: 'styles_finaleNames__TehgR',
    calRow: 'styles_calRow__sqD39',
    credit: 'styles_credit__tBv37',
    creditBrand: 'styles_creditBrand__cOEWc',
    ctaPrimary: 'styles_ctaPrimary__Tg4gr',
    ctaGhost: 'styles_ctaGhost__sxn_Q',
};

const DOOR_CSS = {
    root: 'dastak-door_root__fLKJC',
    rootFixed: 'dastak-door_rootFixed__Evi6N',
    backdrop: 'dastak-door_backdrop__eKkyv',
    stage: 'dastak-door_stage__Gh6vu',
    media: 'dastak-door_media__BViJQ',
    tap: 'dastak-door_tap__unOxz',
    film: 'dastak-door_film__rq_hg',
    knocker: 'dastak-door_knocker__hzMcc',
    ring: 'dastak-door_ring__F4V1f',
    hint: 'dastak-door_hint__JjaMk',
    hintAddressed: 'dastak-door_hintAddressed__bIL3S',
    hintGlow: 'dastak-door_hintGlow__GEnYU',
    toLine: 'dastak-door_toLine__GCn9L',
    hintDeva: 'dastak-door_hintDeva__NBRHG',
    hintLine: 'dastak-door_hintLine__69wM6',
} as const;

const TRIVIA_CSS = {
    card: 'TriviaSection_card__BL_e6',
    sheet: 'TriviaSection_sheet__rwFQE',
    cardBare: 'TriviaSection_cardBare__Yh6pM',
    toran: 'TriviaSection_toran__p5p4_',
    eyebrow: 'TriviaSection_eyebrow__G4_6K',
    heading: 'TriviaSection_heading__42Icp',
    subline: 'TriviaSection_subline__VY4mf',
    sides: 'TriviaSection_sides__TjZE8',
    vs: 'TriviaSection_vs__JzJ5R',
    side: 'TriviaSection_side__Jr5Nh',
    sideOne: 'TriviaSection_sideOne__pwRco',
    sideTwo: 'TriviaSection_sideTwo__7dWQ2',
    sidePip: 'TriviaSection_sidePip__XVAR9',
    sideName: 'TriviaSection_sideName__ChIwK',
    sideFor: 'TriviaSection_sideFor__1Ii4_',
    teaser: 'TriviaSection_teaser__39Ttz',
    panel: 'TriviaSection_panel__oJrf5',
    body: 'TriviaSection_body__yZVue',
    bodyResult: 'TriviaSection_bodyResult__aFlKd',
    topBar: 'TriviaSection_topBar__UUKZb',
    topLines: 'TriviaSection_topLines__EnoKf',
    sheetName: 'TriviaSection_sheetName__AFYkR',
    progress: 'TriviaSection_progress__XYfG_',
    close: 'TriviaSection_close__k24NN',
    dots: 'TriviaSection_dots__1RI1h',
    dot: 'TriviaSection_dot__IMhCJ',
    dotRight: 'TriviaSection_dotRight__ZhyUz',
    dotWrong: 'TriviaSection_dotWrong__ABdFB',
    prompt: 'TriviaSection_prompt__dya3P',
    options: 'TriviaSection_options__Rps0X',
    option: 'TriviaSection_option__1ZYxo',
    pip: 'TriviaSection_pip__Uhxdj',
    optionText: 'TriviaSection_optionText__XOmAO',
    optionRight: 'TriviaSection_optionRight__kVrqU',
    optionWrong: 'TriviaSection_optionWrong__sOdvw',
    optionPulse: 'TriviaSection_optionPulse__uBnp0',
    verdictLine: 'TriviaSection_verdictLine__OE07C',
    verdictRight: 'TriviaSection_verdictRight__ZHpR3',
    verdictWrong: 'TriviaSection_verdictWrong__CCQBT',
    result: 'TriviaSection_result__OOvUA',
    score: 'TriviaSection_score__eDzd4',
    scoreTotal: 'TriviaSection_scoreTotal__tikF1',
    verdict: 'TriviaSection_verdict__XBbfU',
    tally: 'TriviaSection_tally__bDf8p',
    previewNote: 'TriviaSection_previewNote__PjisW',
    actions: 'TriviaSection_actions__CVruD',
    primary: 'TriviaSection_primary__rjW9B',
    ghost: 'TriviaSection_ghost__dmGuH',
    next: 'TriviaSection_next__Gal3f',
} as const;

const REGARDS_CSS = {
    regards: 'RegardsSection_regards__s_woQ',
    rule: 'RegardsSection_rule__3XduN',
    heading: 'RegardsSection_heading__MdXDc',
    note: 'RegardsSection_note__526nI',
    people: 'RegardsSection_people__fasyO',
    person: 'RegardsSection_person__E4ElJ',
    name: 'RegardsSection_name__ssH6l',
    phone: 'RegardsSection_phone__lcdsz',
} as const;

/* ============================================================================
   Helpers & Color Name Lookup (Module 53109)
   ============================================================================ */

function prefersReducedMotion(): boolean {
    return false;
}

const COLOR_SWATCHES: Array<{ hex: string; name: string }> = [
    { hex: '#FDFDFB', name: 'White' },
    { hex: '#F1E8D7', name: 'Ivory' },
    { hex: '#F6E8CE', name: 'Vanilla' },
    { hex: '#E8D5AE', name: 'Champagne' },
    { hex: '#D9B98A', name: 'Latte' },
    { hex: '#E3B23C', name: 'Haldi yellow' },
    { hex: '#E9A227', name: 'Marigold' },
    { hex: '#E8862A', name: 'Marigold' },
    { hex: '#C9962E', name: 'Mustard' },
    { hex: '#C9A24B', name: 'Gold' },
    { hex: '#F5BC9C', name: 'Peach' },
    { hex: '#B4552D', name: 'Rust' },
    { hex: '#D98995', name: 'Rose' },
    { hex: '#B02E2C', name: 'Red' },
    { hex: '#7A1F2B', name: 'Maroon' },
    { hex: '#5A1B26', name: 'Burgundy' },
    { hex: '#43121C', name: 'Oxblood' },
    { hex: '#7A8450', name: 'Mehendi' },
    { hex: '#1F6E52', name: 'Emerald' },
    { hex: '#1D2B53', name: 'Navy' },
];

function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace('#', '');
    return [
        parseInt(clean.slice(0, 2), 16) || 0,
        parseInt(clean.slice(2, 4), 16) || 0,
        parseInt(clean.slice(4, 6), 16) || 0,
    ];
}

function getColorName(hex: string): string {
    const clean = hex.trim().toUpperCase();
    const exact = COLOR_SWATCHES.find((c) => c.hex.toUpperCase() === clean);
    if (exact) return exact.name;
    if (!/^#[0-9A-F]{6}$/i.test(clean)) return '';
    const rgb = hexToRgb(clean);
    let best = COLOR_SWATCHES[0];
    let bestDist = Infinity;
    for (const c of COLOR_SWATCHES) {
        const t = hexToRgb(c.hex);
        const rmean = (rgb[0] + t[0]) / 2;
        const dr = rgb[0] - t[0];
        const dg = rgb[1] - t[1];
        const db = rgb[2] - t[2];
        const dist = (2 + rmean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rmean) / 256) * db * db;
        if (dist < bestDist) {
            bestDist = dist;
            best = c;
        }
    }
    return best.name;
}

const MONTHS_FULL = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
const WEEKDAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function toIsoDate(raw?: string | Date | null, fallback = '2027-05-14'): string {
    if (!raw) return fallback;
    if (typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) {
        return raw.trim();
    }
    const parsed = parseWeddingDate(raw);
    if (!parsed || Number.isNaN(parsed.getTime())) return fallback;
    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, '0');
    const dd = String(parsed.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function formatDastakDate(isoOrRaw: string): string {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoOrRaw.trim());
    if (m) {
        const monthIdx = Number(m[2]) - 1;
        if (monthIdx >= 0 && monthIdx < 12) {
            return `${m[3]} ${MONTHS_FULL[monthIdx]} ${m[1]}`;
        }
    }
    const parsed = parseWeddingDate(isoOrRaw);
    if (parsed && !Number.isNaN(parsed.getTime())) {
        return `${String(parsed.getDate()).padStart(2, '0')} ${MONTHS_FULL[parsed.getMonth()]} ${parsed.getFullYear()}`;
    }
    return isoOrRaw;
}

function formatShortDots(isoDate: string): string {
    const d = new Date(`${isoDate}T00:00:00`);
    if (Number.isNaN(d.getTime())) return '14.05.27';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}.${mm}.${yy}`;
}

/* ============================================================================
   Ornamental Primitives (Diamond & Divider)
   ============================================================================ */

function Diamond({ className }: { className?: string }) {
    return <span className={`${R.diamond} ${className ?? ''}`.trim()} aria-hidden="true" />;
}

function Divider({ className }: { className?: string }) {
    return (
        <span className={`${R.divider} ${className ?? ''}`.trim()} aria-hidden="true">
            <i />
            <b />
            <i />
        </span>
    );
}

/* ============================================================================
   RevealOnScroll (Module 32906 — b.g)
   ============================================================================ */

function RevealOnScroll({
    children,
    delay = 0,
    distance = 26,
    className = '',
    as: Tag = 'div',
    style,
}: {
    children: React.ReactNode;
    delay?: number;
    distance?: number;
    className?: string;
    as?: any;
    style?: React.CSSProperties;
}) {
    const ref = useRef<HTMLElement | null>(null);
    const [state, setState] = useState<'rest' | 'hidden' | 'revealed'>('rest');

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el || prefersReducedMotion()) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top < vh && rect.bottom > 0) return;
        setState('hidden');
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setState('revealed');
                        observer.disconnect();
                    }
                }
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const animStyle: React.CSSProperties =
        state === 'hidden'
            ? {
                  opacity: 0,
                  transform: `translateY(${distance}px)`,
                  transition: 'none',
                  willChange: 'opacity, transform',
              }
            : state === 'revealed'
            ? {
                  opacity: 1,
                  transform: 'none',
                  transition: `opacity 0.9s ${ease} ${delay}s, transform 1.1s ${ease} ${delay}s`,
              }
            : {};

    return (
        <Tag
            ref={ref}
            className={className}
            data-revealed={state === 'hidden' ? 'false' : 'true'}
            style={{ ...style, ...animStyle }}
        >
            {children}
        </Tag>
    );
}

/* ============================================================================
   1. Opening Haveli Door (Module 15404 — DastakDoor `j`)
      - Synthesizes 3 ceremonial wooden knocks via Web Audio API
      - Triggers dkPunch scale animation, plays door.mp4 at 0.8x, then melts away
   ============================================================================ */

function playKnockSound(
    ctx: AudioContext,
    startTime: number,
    freq: number,
    duration: number,
    gainPeak: number
) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(0.55 * freq, startTime + duration);
    gain.gain.setValueAtTime(gainPeak, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
}

function DastakDoor({
    show,
    doorMp4,
    doorPoster,
    hint = 'दस्तक दीजिए',
    subHint = 'Knock to open',
    openLabel = 'Knock to open the invitation',
    toLine,
    onOpen,
    onHandoff,
    handoffLeadSec = 0.45,
    playbackRate = 0.8,
    backdrop = '#2A1F17',
}: {
    show: boolean;
    doorMp4: string;
    doorPoster: string;
    hint?: string;
    subHint?: string;
    openLabel?: string;
    toLine?: string;
    onOpen?: () => void;
    onHandoff?: () => void;
    handoffLeadSec?: number;
    playbackRate?: number;
    backdrop?: string;
}) {
    const toId = useId();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const onOpenRef = useRef(onOpen);
    const onHandoffRef = useRef(onHandoff);

    useEffect(() => {
        onOpenRef.current = onOpen;
        onHandoffRef.current = onHandoff;
    }, [onOpen, onHandoff]);

    const handedOffRef = useRef(false);
    const musicStartedRef = useRef(false);
    const escapedRef = useRef(false);
    const musicTimerRef = useRef<number>(0);

    const [phase, setPhase] = useState<'closed' | 'knocking' | 'playing' | 'leaving' | 'hidden'>(
        show ? 'closed' : 'hidden'
    );
    const [exitMode, setExitMode] = useState<'escape' | null>(null);
    const [reduceMotion, setReduceMotion] = useState(false);

    useLayoutEffect(() => {
        setReduceMotion(prefersReducedMotion());
        setPhase(show ? 'closed' : 'hidden');
        setExitMode(null);
        handedOffRef.current = false;
        escapedRef.current = false;
        musicStartedRef.current = false;
    }, [show]);

    useLayoutEffect(() => {
        if (phase === 'hidden') return;
        const root = document.documentElement;
        root.setAttribute('data-dk-armed', '');
        return () => root.removeAttribute('data-dk-armed');
    }, [phase]);

    useEffect(() => {
        if (phase === 'closed') {
            btnRef.current?.focus();
        }
    }, [phase]);

    useEffect(() => {
        const scroller = (document.scrollingElement ?? document.documentElement) as HTMLElement;
        if (phase === 'hidden' || phase === 'leaving') {
            scroller.style.removeProperty('overflow-y');
            return;
        }
        scroller.style.overflowY = 'hidden';
        return () => {
            scroller.style.removeProperty('overflow-y');
        };
    }, [phase]);

    // Pre-warm video decoder when closed
    useEffect(() => {
        if (phase !== 'closed' || reduceMotion) return;
        const v = videoRef.current;
        if (!v) return;
        const onPlaying = () => {
            v.pause();
            v.currentTime = 0;
        };
        v.addEventListener('playing', onPlaying);
        v.muted = true;
        v.play().catch(() => undefined);
        return () => v.removeEventListener('playing', onPlaying);
    }, [phase, reduceMotion]);

    const triggerMusicPlay = useCallback(() => {
        if (!musicStartedRef.current && !escapedRef.current) {
            musicStartedRef.current = true;
            window.dispatchEvent(
                new CustomEvent('wed:music-play', { detail: { rampMs: 4500 } })
            );
        }
    }, []);

    const triggerHandoff = useCallback(() => {
        if (handedOffRef.current) return;
        handedOffRef.current = true;
        triggerMusicPlay();
        onHandoffRef.current?.();
        videoRef.current?.pause();
        setPhase('leaving');
    }, [triggerMusicPlay]);

    const handleKnock = useCallback(() => {
        if (phase !== 'closed') return;
        onOpenRef.current?.();
        navigator.vibrate?.([14, 90, 14, 90, 20]);
        window.dispatchEvent(new CustomEvent('wed:music-arm'));
        if (reduceMotion) {
            triggerHandoff();
            return;
        }
        try {
            const AudioCtx =
                window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            if (AudioCtx) {
                const ctx = new AudioCtx();
                const t0 = ctx.currentTime + 0.02;
                playKnockSound(ctx, t0, 120, 0.16, 0.9);
                playKnockSound(ctx, t0 + 0.24, 115, 0.16, 0.9);
                playKnockSound(ctx, t0 + 0.48, 110, 0.2, 1.0);
                window.setTimeout(() => {
                    ctx.close().catch(() => undefined);
                }, 1200);
            }
        } catch {
            /* ignore audio errors */
        }
        setPhase('knocking');
    }, [phase, reduceMotion, triggerHandoff]);

    useEffect(() => {
        if (phase !== 'knocking') return;
        const v = videoRef.current;
        if (!v) {
            const id = window.setTimeout(triggerHandoff, 700);
            return () => window.clearTimeout(id);
        }
        const onError = () => triggerHandoff();
        v.addEventListener('error', onError);
        const startTimer = window.setTimeout(() => {
            if (v.error) {
                triggerHandoff();
                return;
            }
            if (v.networkState === v.NETWORK_NO_SOURCE) v.load();
            v.playbackRate = playbackRate;
            v.muted = false;
            const afterPlay = () => {
                musicTimerRef.current = window.setTimeout(triggerMusicPlay, 300);
            };
            v.play()
                .then(afterPlay)
                .catch(() => {
                    v.muted = true;
                    v.play().then(afterPlay).catch(triggerHandoff);
                });
            setPhase('playing');
        }, 700);
        const safetyTimer = window.setTimeout(() => {
            if (v.currentTime < 0.1) triggerHandoff();
        }, 8000);
        return () => {
            window.clearTimeout(startTimer);
            window.clearTimeout(safetyTimer);
            v.removeEventListener('error', onError);
        };
    }, [phase, playbackRate, triggerHandoff, triggerMusicPlay]);

    useEffect(() => {
        if (phase !== 'playing') return;
        const v = videoRef.current;
        if (!v) return;
        let rafId = 0;
        const checkTime = () => {
            const dur = v.duration;
            if (Number.isFinite(dur) && dur > 0 && v.currentTime >= dur - handoffLeadSec) {
                triggerHandoff();
            } else {
                rafId = window.requestAnimationFrame(checkTime);
            }
        };
        rafId = window.requestAnimationFrame(checkTime);
        const estDur = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 5.17;
        const rate = playbackRate > 0 ? playbackRate : 1;
        const fallbackTimer = window.setTimeout(triggerHandoff, (estDur / rate) * 1000 + 2000);
        v.addEventListener('ended', triggerHandoff);
        v.addEventListener('error', triggerHandoff);
        return () => {
            window.cancelAnimationFrame(rafId);
            v.removeEventListener('ended', triggerHandoff);
            v.removeEventListener('error', triggerHandoff);
            window.clearTimeout(fallbackTimer);
        };
    }, [phase, handoffLeadSec, playbackRate, triggerHandoff]);

    useEffect(() => {
        if (phase !== 'leaving') return;
        const ms = reduceMotion ? 300 : exitMode === 'escape' ? 450 : 900;
        const id = window.setTimeout(() => setPhase('hidden'), ms);
        return () => window.clearTimeout(id);
    }, [phase, exitMode, reduceMotion]);

    useEffect(() => {
        if (phase !== 'closed') return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onOpenRef.current?.();
                escapedRef.current = true;
                setExitMode('escape');
                triggerHandoff();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [phase, triggerHandoff]);

    useEffect(() => {
        return () => window.clearTimeout(musicTimerRef.current);
    }, []);

    if (phase === 'hidden') return null;

    return (
        <div
            data-phase={phase}
            data-exit={exitMode ?? undefined}
            data-dk-door=""
            data-live=""
            className={`${DOOR_CSS.root} ${DOOR_CSS.rootFixed}`}
            style={{ '--dk-backdrop': backdrop } as React.CSSProperties}
        >
            <div className={DOOR_CSS.backdrop} aria-hidden="true" />
            <button
                ref={btnRef}
                type="button"
                className={DOOR_CSS.tap}
                onClick={handleKnock}
                aria-label={openLabel}
                aria-describedby={toLine ? toId : undefined}
            >
                <span className={DOOR_CSS.stage}>
                    <img
                        className={DOOR_CSS.media}
                        src={doorPoster}
                        alt=""
                        aria-hidden="true"
                        fetchPriority="high"
                    />
                    {!reduceMotion && (
                        <video
                            ref={videoRef}
                            className={`${DOOR_CSS.media} ${DOOR_CSS.film}`}
                            style={{ backgroundImage: `url("${doorPoster}")` }}
                            poster={doorPoster}
                            muted
                            playsInline
                            preload="auto"
                            disablePictureInPicture
                            aria-hidden="true"
                        >
                            <source src={doorMp4} type="video/mp4" />
                        </video>
                    )}
                    <span className={DOOR_CSS.knocker} aria-hidden="true">
                        <span className={DOOR_CSS.ring} />
                    </span>
                    <span
                        className={
                            toLine
                                ? `${DOOR_CSS.hint} ${DOOR_CSS.hintAddressed}`
                                : DOOR_CSS.hint
                        }
                    >
                        <span className={DOOR_CSS.hintGlow} aria-hidden="true" />
                        {toLine ? (
                            <span id={toId} className={DOOR_CSS.toLine}>
                                {toLine}
                            </span>
                        ) : null}
                        <span className={DOOR_CSS.hintDeva}>{hint}</span>
                        {subHint ? <span className={DOOR_CSS.hintLine}>{subHint}</span> : null}
                    </span>
                </span>
            </button>
        </div>
    );
}

/* ============================================================================
   2. Ambient Falling Petal Canvas (Module 76977 — w.p)
   ============================================================================ */

const AMBIENT_COLORS = ['#E8862A', '#F2B950', '#C9962E', '#F6E8CE'];

function AmbientPetalCanvas({
    count = 18,
    narrowScale = 0.6,
    colors = AMBIENT_COLORS,
    sizeRange = [4, 8],
    crossSeconds = [14, 23],
}: {
    count?: number;
    narrowScale?: number;
    colors?: string[];
    sizeRange?: [number, number];
    crossSeconds?: [number, number];
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const reduce = prefersReducedMotion();
        const total = Math.round(count * (window.innerWidth < 720 ? narrowScale : 1));
        const [minR, maxR] = sizeRange;
        const fallSpeed = (t: number) =>
            1.14 / ((crossSeconds[1] + (crossSeconds[0] - crossSeconds[1]) * t) * 8);

        let w = 0;
        let h = 0;
        let rafId = 0;
        let running = false;
        let inView = true;
        let lastTime = performance.now();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const shadeCache = new Map<string, string>();

        const spawn = (initial: boolean) => ({
            x: Math.random(),
            y: initial ? Math.random() : -0.06,
            r: minR + Math.random() * (maxR - minR),
            tilt: Math.random() * Math.PI * 2,
            tiltSpeed: (Math.random() - 0.5) * 2.4,
            fall: fallSpeed(Math.random()),
            sway: 0.012 + 0.03 * Math.random(),
            swayPhase: Math.random() * Math.PI * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: 0.55 + 0.4 * Math.random(),
        });

        const petals = Array.from({ length: total }, () => spawn(true));

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            w = parent.clientWidth;
            h = parent.clientHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const darken = (hex: string) => {
            const cached = shadeCache.get(hex);
            if (cached) return cached;
            const num = parseInt(hex.slice(1), 16);
            const r = Math.max(0, ((num >> 16) & 255) - 36);
            const g = Math.max(0, ((num >> 8) & 255) - 30);
            const b = Math.max(0, (num & 255) - 18);
            const res = `rgb(${r},${g},${b})`;
            shadeCache.set(hex, res);
            return res;
        };

        const drawPetal = (p: ReturnType<typeof spawn>, sec: number) => {
            const px = (p.x + Math.sin(0.7 * sec + p.swayPhase) * p.sway) * w;
            const py = p.y * h;
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(p.tilt);
            ctx.scale(1, p.shape);
            const grad = ctx.createRadialGradient(0, 0, 0.5, 0, 0, p.r);
            grad.addColorStop(0, p.color);
            grad.addColorStop(1, darken(p.color));
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(0, -p.r);
            ctx.quadraticCurveTo(0.9 * p.r, -0.2 * p.r, 0, p.r);
            ctx.quadraticCurveTo(-0.9 * p.r, -0.2 * p.r, 0, -p.r);
            ctx.fill();
            ctx.restore();
        };

        const tick = (now: number) => {
            rafId = requestAnimationFrame(tick);
            const dt = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;
            const sec = now / 1000;
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < petals.length; i++) {
                const p = petals[i];
                p.y += p.fall * dt * 8;
                p.tilt += p.tiltSpeed * dt;
                if (p.y > 1.08) petals[i] = spawn(false);
                drawPetal(petals[i], sec);
            }
        };

        const start = () => {
            if (!running && !reduce && !document.hidden && inView) {
                running = true;
                lastTime = performance.now();
                rafId = requestAnimationFrame(tick);
            }
        };

        const stop = () => {
            running = false;
            cancelAnimationFrame(rafId);
        };

        resize();
        if (reduce) {
            ctx.clearRect(0, 0, w, h);
            for (const p of petals.slice(0, Math.round(0.5 * total))) {
                drawPetal(p, 0);
            }
        } else {
            start();
        }

        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    inView = entry.isIntersecting;
                    if (inView) start();
                    else stop();
                }
            },
            { threshold: 0.02 }
        );
        io.observe(canvas);

        const ro = new ResizeObserver(resize);
        if (canvas.parentElement) ro.observe(canvas.parentElement);

        const onVis = () => {
            if (document.hidden) stop();
            else start();
        };
        document.addEventListener('visibilitychange', onVis);

        return () => {
            stop();
            io.disconnect();
            ro.disconnect();
            document.removeEventListener('visibilitychange', onVis);
        };
    }, [count, narrowScale, colors, sizeRange, crossSeconds]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        />
    );
}

/* ============================================================================
   3. Muhurat Interactive Rangoli Petal-Sweep Date Reveal (Module 15404 — `ea`)
      - 150–250 physics-driven marigold, rose & leaf petals on a 2D canvas
      - Guests swipe/drag petals aside or tap "Sweep the petals" (or auto-sweeps
        3.6s after entering viewport)
   ============================================================================ */

const RANGOLI_PETAL_SPRITES = [
    'petal-marigold-1',
    'petal-marigold-2',
    'petal-marigold-3',
    'petal-marigold-4',
    'petal-rose-1',
    'petal-rose-2',
    'marigold-head-1',
    'marigold-head-2',
    'leaf-sprig',
];
const RANGOLI_WEIGHTS = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 6, 7, 8];
const RANGOLI_RING_SPRITES = [
    'petal-marigold-1',
    'petal-rose-1',
    'petal-marigold-3',
    'marigold-head-1',
    'petal-marigold-2',
    'petal-rose-2',
    'petal-marigold-4',
    'leaf-sprig',
    'petal-marigold-3',
    'petal-rose-1',
    'petal-marigold-1',
    'marigold-head-2',
];
const RANGOLI_DRIFT_SPRITES = ['petal-marigold-1', 'petal-rose-2', 'petal-marigold-4'];

interface RangoliParticle {
    i: number;
    x: number;
    y: number;
    rot: number;
    w: number;
    h: number;
    vx: number;
    vy: number;
    vr: number;
    gone: boolean;
}

function MuhuratRangoliSweep({ date }: { date: string }) {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const sweepFnRef = useRef<(() => void) | null>(null);

    const [canCanvas, setCanCanvas] = useState(false);
    const [laid, setLaid] = useState(false);
    const [leavingCue, setLeavingCue] = useState(false);
    const [swept, setSwept] = useState(false);

    useLayoutEffect(() => {
        if (!prefersReducedMotion() && document.createElement('canvas').getContext('2d')) {
            setCanCanvas(true);
        }
    }, []);

    useEffect(() => {
        if (!canCanvas || swept) return;
        const stage = stageRef.current;
        const canvas = canvasRef.current;
        if (!stage || !canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setSwept(true);
            return;
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, stage.clientWidth);
        const height = Math.max(1, stage.clientHeight);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const brushRadius = Math.min(96, Math.max(46, 0.17 * width));
        let disposed = false;
        let rafId = 0;
        let animating = false;
        let inViewport = false;
        let burstTriggered = false;
        let userTouched = false;
        let lastFrameTime = 0;
        let frameCount = 0;
        let burstStartTime = 0;
        let alpha = 1;
        let autoSweepTimer = 0;
        let burstFollowTimer = 0;
        let fallbackInitTimer = 0;
        const particles: RangoliParticle[] = [];

        const images = RANGOLI_PETAL_SPRITES.map((name) => {
            const img = new Image();
            img.decoding = 'async';
            img.src = `${ART_BASE}/${name}.webp`;
            return img;
        });

        const makeParticle = (x: number, y: number, baseSize: number): RangoliParticle => {
            const idx = RANGOLI_WEIGHTS[Math.floor(Math.random() * RANGOLI_WEIGHTS.length)];
            const img = images[idx];
            const w =
                baseSize *
                (0.78 + 0.5 * Math.random()) *
                (idx === 6 || idx === 7 ? 1.18 : 1);
            const h = w * (img.naturalWidth > 0 ? img.naturalHeight / img.naturalWidth : 1);
            return {
                i: idx,
                x,
                y,
                rot: Math.random() * Math.PI * 2,
                w,
                h,
                vx: 0,
                vy: 0,
                vr: 0,
                gone: false,
            };
        };

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = alpha;
            for (const p of particles) {
                if (p.gone) continue;
                const img = images[p.i];
                if (img.complete && img.naturalWidth !== 0) {
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rot);
                    ctx.drawImage(img, -p.w / 2, -p.h / 2, p.w, p.h);
                    ctx.restore();
                }
            }
            ctx.globalAlpha = 1;
        };

        const triggerFullBurst = () => {
            if (burstTriggered) return;
            burstTriggered = true;
            clearAutoTimer();
            const cx = width / 2;
            const cy = height / 2;
            for (const p of particles) {
                if (p.gone) continue;
                const dx = p.x - cx;
                const dy = p.y - cy;
                const dist = Math.hypot(dx, dy) || 0.001;
                p.vx += (dx / dist) * 5 + (Math.random() - 0.5) * 1.6;
                p.vy += (dy / dist) * 3.4 - 2.6;
                p.vr += (Math.random() - 0.5) * 0.16;
            }
            burstStartTime = performance.now();
            setLeavingCue(true);
            ensureLoop();
        };

        const triggerAutoSweep = () => {
            if (burstTriggered || userTouched || disposed) return;
            const cx = width / 2;
            const cy = height / 2;
            for (const p of particles) {
                if (p.gone) continue;
                const dx = p.x - cx;
                const dy = p.y - cy;
                const dist = Math.hypot(dx, dy) || 0.001;
                const factor = Math.max(0.3, 1 - dist / (0.62 * width));
                p.vx += (dx / dist) * 14 * factor + (Math.random() - 0.5) * 1.1;
                p.vy += (dy / dist) * 14 * factor + (Math.random() - 0.5) * 1.1;
                p.vr += (Math.random() - 0.5) * 0.16;
            }
            ensureLoop();
            burstFollowTimer = window.setTimeout(triggerFullBurst, 760);
        };

        const scheduleAutoSweep = () => {
            if (!burstTriggered && !userTouched && !autoSweepTimer && particles.length > 0) {
                autoSweepTimer = window.setTimeout(triggerAutoSweep, 3600);
            }
        };

        const clearAutoTimer = () => {
            window.clearTimeout(autoSweepTimer);
            autoSweepTimer = 0;
        };

        const stepPhysics = (now: number) => {
            const dt = Math.min((now - lastFrameTime) / 16.667, 3);
            lastFrameTime = now;

            let anyMoving = false;
            const dampV = Math.pow(0.885, dt);
            const dampR = Math.pow(0.9, dt);
            for (const p of particles) {
                if (p.gone || (p.vx === 0 && p.vy === 0 && p.vr === 0)) continue;
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.rot += p.vr * dt;
                p.vx *= dampV;
                p.vy *= dampV;
                p.vr *= dampR;
                if (Math.abs(p.vx) < 0.03 && Math.abs(p.vy) < 0.03) {
                    p.vx = 0;
                    p.vy = 0;
                }
                if (Math.abs(p.vr) < 0.002) p.vr = 0;
                if (p.vx !== 0 || p.vy !== 0 || p.vr !== 0) anyMoving = true;
                const pad = Math.max(p.w, p.h);
                if (p.x < -pad || p.x > width + pad || p.y < -pad || p.y > height + pad) {
                    p.gone = true;
                }
            }

            if (burstStartTime) {
                const progress = Math.min(1, (now - burstStartTime) / 900);
                alpha = 1 - progress;
                anyMoving = progress < 1;
            }

            render();
            frameCount += 1;

            if (!burstTriggered && particles.length > 0 && (frameCount % 6 === 0 || !anyMoving)) {
                const grid = new Uint8Array(144);
                const cellW = width / 12;
                const cellH = height / 12;
                for (const p of particles) {
                    if (p.gone) continue;
                    const hw = 0.36 * p.w;
                    const hh = 0.36 * p.h;
                    const c0 = Math.max(0, Math.floor((p.x - hw) / cellW));
                    const c1 = Math.min(11, Math.floor((p.x + hw) / cellW));
                    const r0 = Math.max(0, Math.floor((p.y - hh) / cellH));
                    const r1 = Math.min(11, Math.floor((p.y + hh) / cellH));
                    for (let r = r0; r <= r1; r++) {
                        for (let c = c0; c <= c1; c++) {
                            grid[12 * r + c] = 1;
                        }
                    }
                }
                let occupied = 0;
                for (let i = 0; i < grid.length; i++) occupied += grid[i];
                if (1 - occupied / grid.length >= 0.6) {
                    triggerFullBurst();
                    anyMoving = true;
                }
            }

            if (anyMoving) {
                rafId = requestAnimationFrame(stepPhysics);
                return;
            }
            animating = false;
            if (burstStartTime) setSwept(true);
        };

        const ensureLoop = () => {
            if (!animating && !disposed && inViewport && !document.hidden) {
                animating = true;
                lastFrameTime = performance.now();
                rafId = requestAnimationFrame(stepPhysics);
            }
        };

        const stopLoop = () => {
            animating = false;
            cancelAnimationFrame(rafId);
        };

        sweepFnRef.current = triggerFullBurst;

        let pointerDown = false;
        let captured = false;
        let startX = 0;
        let startY = 0;
        let prevX = 0;
        let prevY = 0;

        const getLocalCoords = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: ((e.clientX - rect.left) / rect.width) * width,
                y: ((e.clientY - rect.top) / rect.height) * height,
            };
        };

        const onPointerDown = (e: PointerEvent) => {
            if (burstTriggered) return;
            const pt = getLocalCoords(e);
            startX = pt.x;
            startY = pt.y;
            prevX = pt.x;
            prevY = pt.y;
            pointerDown = true;
            captured = e.pointerType !== 'touch';
            if (captured) {
                try {
                    canvas.setPointerCapture(e.pointerId);
                } catch {
                    /* ignore */
                }
            }
            userTouched = true;
            clearAutoTimer();
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!pointerDown || burstTriggered) return;
            const pt = getLocalCoords(e);
            if (!captured) {
                const dx = pt.x - startX;
                const dy = pt.y - startY;
                if (Math.abs(dy) > 1.2 * Math.abs(dx) && Math.abs(dy) > 8) {
                    pointerDown = false;
                    return;
                }
                if (Math.abs(dx) < 6) return;
                captured = true;
                try {
                    canvas.setPointerCapture(e.pointerId);
                } catch {
                    /* ignore */
                }
            }

            const segDx = pt.x - prevX;
            const segDy = pt.y - prevY;
            const steps = Math.max(1, Math.min(12, Math.ceil(Math.hypot(segDx, segDy) / (0.5 * brushRadius))));
            for (let s = 1; s <= steps; s++) {
                const sx = prevX + (segDx * s) / steps;
                const sy = prevY + (segDy * s) / steps;
                const vxStep = segDx / steps;
                const vyStep = segDy / steps;
                for (const p of particles) {
                    if (p.gone) continue;
                    const rx = p.x - sx;
                    const ry = p.y - sy;
                    const d2 = rx * rx + ry * ry;
                    if (d2 > brushRadius * brushRadius) continue;
                    const dist = Math.sqrt(d2) || 0.001;
                    const falloff = Math.pow(1 - dist / brushRadius, 1.2);
                    p.vx += (rx / dist) * falloff * 13 + vxStep * falloff * 0.85;
                    p.vy += (ry / dist) * falloff * 13 + vyStep * falloff * 0.85;
                    p.vr += (Math.random() - 0.5) * falloff * 0.22;
                }
            }
            prevX = pt.x;
            prevY = pt.y;
            ensureLoop();
        };

        const onPointerUp = () => {
            pointerDown = false;
            captured = false;
        };

        canvas.addEventListener('pointerdown', onPointerDown);
        canvas.addEventListener('pointermove', onPointerMove);
        canvas.addEventListener('pointerup', onPointerUp);
        canvas.addEventListener('pointercancel', onPointerUp);

        const initParticles = () => {
            if (disposed || particles.length > 0) return;
            window.clearTimeout(fallbackInitTimer);
            const totalCount = Math.round(Math.min(250, Math.max(150, (width * height) / 620)));
            const baseSize = 0.082 * width;
            const gridDim = Math.max(6, Math.round(Math.sqrt(0.8 * totalCount)));
            const cellW = width / gridDim;
            const cellH = height / gridDim;
            for (let r = 0; r < gridDim; r++) {
                for (let c = 0; c < gridDim; c++) {
                    particles.push(
                        makeParticle(
                            (c + 0.5) * cellW + (Math.random() - 0.5) * cellW * 1.2,
                            (r + 0.5) * cellH + (Math.random() - 0.5) * cellH * 1.2,
                            baseSize
                        )
                    );
                }
            }
            const centerR = (0.3613 * width) / 2;
            for (let i = particles.length; i < totalCount; i++) {
                const ang = Math.random() * Math.PI * 2;
                const rad = Math.sqrt(Math.random()) * centerR * 1.08;
                particles.push(
                    makeParticle(
                        width / 2 + Math.cos(ang) * rad,
                        height / 2 + Math.sin(ang) * rad,
                        baseSize
                    )
                );
            }
            render();
            setLaid(true);
            if (inViewport) scheduleAutoSweep();
        };

        const io = new IntersectionObserver(
            (entries) => {
                inViewport = entries.some((e) => e.isIntersecting);
                if (inViewport) {
                    ensureLoop();
                    scheduleAutoSweep();
                } else {
                    stopLoop();
                    clearAutoTimer();
                }
            },
            { threshold: 0.5 }
        );
        io.observe(stage);

        Promise.all(images.map((img) => img.decode().catch(() => undefined))).then(initParticles);
        fallbackInitTimer = window.setTimeout(initParticles, 1200);

        return () => {
            disposed = true;
            stopLoop();
            clearAutoTimer();
            window.clearTimeout(burstFollowTimer);
            window.clearTimeout(fallbackInitTimer);
            sweepFnRef.current = null;
            io.disconnect();
            canvas.removeEventListener('pointerdown', onPointerDown);
            canvas.removeEventListener('pointermove', onPointerMove);
            canvas.removeEventListener('pointerup', onPointerUp);
            canvas.removeEventListener('pointercancel', onPointerUp);
        };
    }, [canCanvas, swept]);

    const parsedDate = new Date(`${date}T00:00:00`);
    const validDate = !Number.isNaN(parsedDate.getTime()) ? parsedDate : new Date('2027-05-14T00:00:00');
    const armed = canCanvas && !swept;

    return (
        <div className={R.rgBand}>
            <div
                className={R.rgStage}
                ref={stageRef}
                data-armed={armed ? '' : undefined}
                data-laid={laid ? '' : undefined}
                data-swept={swept ? '' : undefined}
            >
                <img
                    className={R.rgFloor}
                    src="/website-templates/royal-heritage/muhurat/muhurat-floor.webp"
                    alt=""
                    aria-hidden="true"
                    width={1200}
                    height={1200}
                    loading="lazy"
                />
                <span className={R.rgSheen} aria-hidden="true" />
                <time className={R.rgPlaque} dateTime={date}>
                    <span className={R.rgWeekday}>{WEEKDAYS_FULL[validDate.getDay()]}</span>
                    <span className={R.rgDay}>{String(validDate.getDate()).padStart(2, '0')}</span>
                    <span className={R.rgMonth}>
                        {MONTHS_FULL[validDate.getMonth()]} {validDate.getFullYear()}
                    </span>
                </time>
                {swept ? <span className={R.rgShimmer} aria-hidden="true" /> : null}
                {!armed ? (
                    <span className={R.rgRing} aria-hidden="true">
                        {RANGOLI_RING_SPRITES.map((sprite, idx) => (
                            <img
                                key={idx}
                                src={`${ART_BASE}/${sprite}.webp`}
                                alt=""
                                width={96}
                                height={96}
                                loading="lazy"
                                style={{ '--i': idx } as React.CSSProperties}
                            />
                        ))}
                    </span>
                ) : null}
                {swept ? (
                    <span className={R.rgDrift} aria-hidden="true">
                        {RANGOLI_DRIFT_SPRITES.map((sprite, idx) => (
                            <img
                                key={sprite}
                                src={`${ART_BASE}/${sprite}.webp`}
                                alt=""
                                width={96}
                                height={96}
                                loading="lazy"
                                style={{ '--i': idx } as React.CSSProperties}
                            />
                        ))}
                    </span>
                ) : null}
                <span className={`${R.rgDiya} ${R.rgDiyaLeft}`} aria-hidden="true">
                    <span className={R.rgDiyaGlow} />
                    <img src={`${ART_BASE}/diya.webp`} alt="" width={240} height={196} loading="lazy" />
                </span>
                <span className={`${R.rgDiya} ${R.rgDiyaRight}`} aria-hidden="true">
                    <span className={R.rgDiyaGlow} />
                    <img src={`${ART_BASE}/diya.webp`} alt="" width={240} height={196} loading="lazy" />
                </span>
                {armed ? <canvas ref={canvasRef} className={R.rgCanvas} aria-hidden="true" /> : null}
            </div>
            {canCanvas ? (
                <div
                    className={R.rgCue}
                    data-leaving={leavingCue || swept ? '' : undefined}
                >
                    <div className={R.rgCueInner}>
                        <span className={R.rgHint} aria-hidden="true">
                            फूल हटाइए · sweep the petals aside
                        </span>
                        <button
                            type="button"
                            className={R.rgSweepBtn}
                            onClick={() => sweepFnRef.current?.()}
                            aria-label="Sweep the petals aside to reveal the date"
                        >
                            Sweep the petals
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

/* ============================================================================
   4. Live Countdown Section with Swinging Medallions & Ringing Bells (`I`, `D`)
   ============================================================================ */

function computeCountdown(isoDate: string) {
    const target = new Date(`${isoDate}T00:00:00`);
    if (Number.isNaN(target.getTime())) return null;
    const diff = target.getTime() - Date.now();
    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
    }
    return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor(diff / 3600000) % 24,
        minutes: Math.floor(diff / 60000) % 60,
        seconds: Math.floor(diff / 1000) % 60,
        past: false,
    };
}

function CountdownSection({ date }: { date: string }) {
    const [clock, setClock] = useState<ReturnType<typeof computeCountdown>>(null);

    useLayoutEffect(() => {
        setClock(computeCountdown(date));
        const id = window.setInterval(() => setClock(computeCountdown(date)), 1000);
        return () => window.clearInterval(id);
    }, [date]);

    if (!clock) return null;

    const cells = [
        { value: clock.days, label: 'Days' },
        { value: clock.hours, label: 'Hours' },
        { value: clock.minutes, label: 'Mins' },
        { value: clock.seconds, label: 'Secs' },
    ];

    return (
        <section className={`${R.section} ${R.countdownSection}`} id="countdown">
            <div className={R.cdBand}>
                <RevealOnScroll className={R.cdHeadWrap}>
                    <h2 className={R.cdHead}>
                        <span className={R.deva} lang="hi">
                            बस कुछ ही दिन
                        </span>
                        <span className={R.cdLatin}>Until the doors open</span>
                    </h2>
                </RevealOnScroll>
                {/* Same floor plate as the Shubh Muhurat date, with the countdown in its maroon disc */}
                <div className="cd-plate">
                    <div className={R.rgStage}>
                        <img
                            className={R.rgFloor}
                            src="/website-templates/royal-heritage/muhurat/countdown-floor.webp"
                            alt=""
                            aria-hidden="true"
                            width={1200}
                            height={1200}
                            loading="lazy"
                            decoding="async"
                        />
                        <div
                            className="cd-plate-grid"
                            role="timer"
                            aria-label={`${clock.days} days, ${clock.hours} hours, ${clock.minutes} minutes and ${clock.seconds} seconds to go`}
                        >
                            {cells.map((cell) => (
                                <span key={cell.label} className="cd-plate-cell" aria-hidden="true">
                                    <b className="cd-plate-number">{String(cell.value).padStart(2, '0')}</b>
                                    <i className="cd-plate-label">{cell.label}</i>
                                </span>
                            ))}
                        </div>
                        {[R.rgDiyaLeft, R.rgDiyaRight].map((side) => (
                            <span key={side} className={`${R.rgDiya} ${side}`} aria-hidden="true">
                                <span className={R.rgDiyaGlow} />
                                <img src={`${ART_BASE}/diya.webp`} alt="" width={240} height={196} loading="lazy" />
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ============================================================================
   5. Event Doorway Card — 3D Swinging Haveli Doors & FLIP Card Emergence (`H`)
   ============================================================================ */

export interface DastakEventItem {
    name: string;
    date: string;
    time?: string;
    venue?: string;
    desc?: string;
    dressCodeColors?: string[];
    mapsLink?: string;
}

const ALCOVE_PLATES = [
    { plate: 'alcove-mehndi', match: /meh[aeu]?nd[iy]|mehdi|henna/i },
    { plate: 'alcove-haldi', match: /haldi|pithi|turmeric/i },
];

function fitAlcoveTitle(el: HTMLElement, initialScale: number) {
    let scale = initialScale;
    el.style.setProperty('--dk-name-fit', String(scale));
    for (let iter = 0; iter < 3; iter++) {
        const availW = el.getBoundingClientRect().width - 1;
        const range = document.createRange();
        range.selectNodeContents(el);
        const rects = Array.from(range.getClientRects());
        const lines = new Map<number, { left: number; right: number }>();
        for (const r of rects) {
            if (r.width <= 0) continue;
            const topKey = Math.round(r.top);
            const cur = lines.get(topKey);
            if (cur) {
                cur.left = Math.min(cur.left, r.left);
                cur.right = Math.max(cur.right, r.right);
            } else {
                lines.set(topKey, { left: r.left, right: r.right });
            }
        }
        let maxW = 0;
        for (const line of lines.values()) {
            maxW = Math.max(maxW, line.right - line.left);
        }
        if (availW <= 0 || maxW <= 0 || maxW <= availW) return;
        const next = Math.max(0.4, Math.floor(((scale * availW) / maxW) * 1000) / 1000);
        if (next >= scale) return;
        scale = next;
        el.style.setProperty('--dk-name-fit', String(scale));
    }
}

function EventDoorwayCard({
    event,
    coupleLabel,
    fallbackLocation,
}: {
    event: DastakEventItem;
    coupleLabel: string;
    fallbackLocation: string;
}) {
    const revealMarkRef = useRef<HTMLSpanElement | null>(null);
    const apertureRef = useRef<HTMLDivElement | null>(null);
    const cardClipRef = useRef<HTMLDivElement | null>(null);
    const eventCardRef = useRef<HTMLDivElement | null>(null);
    const knockBtnRef = useRef<HTMLButtonElement | null>(null);
    const alcoveNameRef = useRef<HTMLSpanElement | null>(null);
    const titleId = useId();

    const baseNameFit = useMemo(() => {
        let longest = 0;
        for (const word of event.name.split(/\s+/)) longest = Math.max(longest, word.length);
        return Math.round(1000 * Math.max(0.5, 8 / Math.max(8, longest))) / 1000;
    }, [event.name]);

    const [canAnimate, setCanAnimate] = useState(false);
    const [opened, setOpened] = useState(false);
    const isOpen = !canAnimate || opened;
    const isRevealed = canAnimate && opened;

    const openDoorway = useCallback(() => {
        const ap = apertureRef.current;
        const clip = cardClipRef.current;
        const card = eventCardRef.current;
        if (ap && clip && card) {
            const aRect = ap.getBoundingClientRect();
            const clipRect = clip.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            if (aRect.width > 0 && aRect.height > 0 && cardRect.width > 0 && cardRect.height > 0) {
                const scale = Math.min(
                    (0.62 * aRect.width) / cardRect.width,
                    (0.58 * aRect.height) / cardRect.height
                );
                const sw = cardRect.width * scale;
                const sh = cardRect.height * scale;
                const tx = aRect.left + (aRect.width - sw) / 2;
                const ty = Math.max(aRect.top + 0.04 * aRect.height, aRect.bottom + 0.06 * aRect.height - sh);
                const px = (v: number) => `${Math.round(10 * v) / 10}px`;
                const transform = `translate(${px(tx - cardRect.left)}, ${px(ty - cardRect.top)}) scale(${
                    Math.round(10000 * scale) / 10000
                })`;
                const clipPath = `inset(${px(aRect.top - clipRect.top)} ${px(
                    clipRect.right - aRect.right
                )} ${px(clipRect.bottom - aRect.bottom)} ${px(aRect.left - clipRect.left)})`;
                card.style.transition = 'none';
                card.style.transform = transform;
                clip.style.transition = 'none';
                clip.style.clipPath = clipPath;
                void card.offsetWidth;
            }
        }
        if (knockBtnRef.current && knockBtnRef.current === document.activeElement) {
            window.requestAnimationFrame(() => eventCardRef.current?.focus());
        }
        setOpened(true);
    }, []);

    useLayoutEffect(() => {
        if (!prefersReducedMotion()) setCanAnimate(true);
    }, []);

    useLayoutEffect(() => {
        if (!canAnimate || opened) return;
        const mark = revealMarkRef.current;
        if (!mark) return;
        if (typeof IntersectionObserver === 'undefined') {
            setOpened(true);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    openDoorway();
                    io.disconnect();
                }
            },
            { rootMargin: '100000px 0px -10% 0px' }
        );
        io.observe(mark);
        return () => io.disconnect();
    }, [canAnimate, opened, openDoorway]);

    useLayoutEffect(() => {
        if (!isRevealed) return;
        const clip = cardClipRef.current;
        const card = eventCardRef.current;
        if (card && clip) {
            card.style.transition = '';
            card.style.transform = '';
            clip.style.transition = '';
            clip.style.clipPath = '';
        }
    }, [isRevealed]);

    useLayoutEffect(() => {
        if (alcoveNameRef.current) fitAlcoveTitle(alcoveNameRef.current, baseNameFit);
    });

    const formattedTime = useMemo(() => {
        if (!event.time) return '';
        if (/^\d{2}:\d{2}$/.test(event.time.trim())) {
            const [hh, mm] = event.time.trim().split(':').map(Number);
            return `${hh % 12 === 0 ? 12 : hh % 12}:${String(mm).padStart(2, '0')} ${
                hh < 12 ? 'AM' : 'PM'
            }`;
        }
        return formatDisplayTime(event.time) || event.time;
    }, [event.time]);

    const metaLine = [formatDastakDate(event.date), formattedTime].filter(Boolean).join(' · ');

    const calLinks = useMemo(() => {
        const iso = toIsoDate(event.date, '');
        if (!iso) return null;
        const tPart = event.time && /^\d{2}:\d{2}$/.test(event.time.trim()) ? event.time.trim() : '19:00';
        const start = new Date(`${iso}T${tPart}:00`);
        if (Number.isNaN(start.getTime())) return null;
        const end = new Date(start.getTime() + 5400000);
        const fmt = (d: Date) =>
            `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
                d.getDate()
            ).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}${String(
                d.getMinutes()
            ).padStart(2, '0')}00`;
        const title = `${event.name} — ${coupleLabel}`;
        const loc = [event.venue, fallbackLocation].filter(Boolean).join(', ');
        const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            title
        )}&dates=${fmt(start)}/${fmt(end)}${loc ? `&location=${encodeURIComponent(loc)}` : ''}`;
        const mapsUrl =
            event.mapsLink && event.mapsLink.trim()
                ? event.mapsLink.trim()
                : loc
                ? `https://maps.google.com/?q=${encodeURIComponent(loc)}`
                : '';
        return { google, mapsUrl };
    }, [event, coupleLabel, fallbackLocation]);

    const alcovePlate =
        ALCOVE_PLATES.find(({ match }) => match.test(event.name))?.plate ?? 'alcove-phere';

    const renderEventCard = () => (
        <div className={R.cardClip} ref={cardClipRef}>
            <div className={R.eventCard} ref={eventCardRef} tabIndex={-1}>
                <span className={R.eventPaper} aria-hidden="true" />
                <img
                    className={R.eventPetal}
                    src={`${ART_BASE}/marigold-head-2.webp`}
                    alt=""
                    aria-hidden="true"
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                />
                <div className={R.eventCardInner}>
                    <h3 className={R.eventName} id={titleId}>
                        {event.name}
                    </h3>
                    <Divider className={R.eventRule} />
                    {metaLine ? <p className={R.eventMeta}>{metaLine}</p> : null}
                    {event.venue ? <p className={R.eventVenue}>{event.venue}</p> : null}
                    {event.desc ? <p className={R.eventDesc}>{event.desc}</p> : null}
                    {event.dressCodeColors && event.dressCodeColors.length > 0 ? (
                        <div className={R.eventDress}>
                            <span className={R.eventDressLabel}>Dress code</span>
                            <span className={R.eventDressList}>
                                {event.dressCodeColors.map((hex) => {
                                    const colorName = getColorName(hex);
                                    return (
                                        <span key={hex} className={R.eventDressChip}>
                                            <span
                                                className={R.eventDressDot}
                                                style={{ background: hex }}
                                                aria-hidden="true"
                                            />
                                            {colorName ? (
                                                <span className={R.eventDressName}>{colorName}</span>
                                            ) : null}
                                        </span>
                                    );
                                })}
                            </span>
                        </div>
                    ) : null}
                    {calLinks ? (
                        <div className={R.eventActions}>
                            <a href={calLinks.google} target="_blank" rel="noreferrer">
                                Add to calendar
                            </a>
                            {calLinks.mapsUrl ? (
                                <a href={calLinks.mapsUrl} target="_blank" rel="noreferrer">
                                    Map
                                </a>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );

    return (
        <article
            className={R.doorway}
            data-open={isOpen ? '' : undefined}
            data-revealed={isRevealed ? '' : undefined}
            aria-labelledby={titleId}
        >
            <div className={R.stage}>
                <span className={R.revealMark} ref={revealMarkRef} aria-hidden="true" />
                <div className={R.aperture} ref={apertureRef} aria-hidden="true">
                    <img
                        className={R.alcove}
                        src={`${ART_BASE}/${alcovePlate}.webp`}
                        alt=""
                        width={700}
                        height={1050}
                        loading="lazy"
                    />
                    <span className={R.alcoveGlow} />
                    {/* lamp light glowing through the jali while the shutters are closed */}
                    <span className="jh-lamp" />
                    <div className={R.leaves}>
                        <div className={`${R.leaf} ${R.leafLeft}`}>
                            <img
                                className={R.leafArt}
                                src={`${ART_BASE}/jharokha-shutter-left.webp`}
                                alt=""
                                width={200}
                                height={800}
                                loading="lazy"
                            />
                            <span className={R.leafShade} />
                        </div>
                        <div className={`${R.leaf} ${R.leafRight}`}>
                            <img
                                className={R.leafArt}
                                src={`${ART_BASE}/jharokha-shutter-right.webp`}
                                alt=""
                                width={200}
                                height={800}
                                loading="lazy"
                            />
                            <span className={R.leafShade} />
                        </div>
                    </div>
                    <span className="jh-recess" />
                    <span
                        className={R.alcoveName}
                        ref={alcoveNameRef}
                        style={{ '--dk-name-fit': baseNameFit } as React.CSSProperties}
                    >
                        {event.name}
                    </span>
                </div>
                <img
                    className={`${R.arch} jh-frame`}
                    src="/website-templates/royal-heritage/events/jharokha-frame.webp"
                    alt=""
                    aria-hidden="true"
                    width={720}
                    height={1080}
                    loading="lazy"
                />
                {/* warm light spilling onto the carved stone once the shutters open, and a gold sheen */}
                <span className="jh-spill" aria-hidden="true" />
                <span className="jh-sheen" aria-hidden="true" />
                {/* marigold strings hanging from both ends of the cornice */}
                {(['left', 'right'] as const).map((side) => (
                    <span key={side} className={`jh-mala jh-mala-${side}`} aria-hidden="true">
                        <img
                            src={`${ART_BASE}/garland-string.webp`}
                            alt=""
                            width={84}
                            height={800}
                            loading="lazy"
                        />
                    </span>
                ))}
                <span className={`${R.diya} ${R.diyaLeft}`} aria-hidden="true">
                    <span className={R.diyaGlow} />
                    <img
                        className={R.diyaArt}
                        src={`${ART_BASE}/diya.webp`}
                        alt=""
                        width={240}
                        height={196}
                        loading="lazy"
                    />
                </span>
                <span className={`${R.diya} ${R.diyaRight}`} aria-hidden="true">
                    <span className={R.diyaGlow} />
                    <img
                        className={R.diyaArt}
                        src={`${ART_BASE}/diya.webp`}
                        alt=""
                        width={240}
                        height={196}
                        loading="lazy"
                    />
                </span>
                {!isOpen ? (
                    <button
                        ref={knockBtnRef}
                        type="button"
                        className={R.knock}
                        aria-label={`Open the door to ${event.name}`}
                        onClick={openDoorway}
                    />
                ) : null}
            </div>
            {renderEventCard()}
        </article>
    );
}

/* ============================================================================
   6. Kitna Jaante Ho? — Ladkiwale vs Ladkewale Trivia Game (Module 14662)
   ============================================================================ */

interface TriviaQuestion {
    id: string;
    prompt: string;
    options: [string, string, string, string];
    answer: number;
}

const TORAN_DROPS = [
    { x: 29.6, y: 11.2, scale: 0.62, buta: false },
    { x: 57.4, y: 16.4, scale: 0.76, buta: true },
    { x: 88, y: 19.5, scale: 0.88, buta: false },
    { x: 120, y: 20.5, scale: 1, buta: true },
    { x: 152, y: 19.5, scale: 0.88, buta: false },
    { x: 182.6, y: 16.4, scale: 0.76, buta: true },
    { x: 210.4, y: 11.2, scale: 0.62, buta: false },
];

function TriviaToranSvg() {
    return (
        <svg
            className={TRIVIA_CSS.toran}
            viewBox="0 0 240 36"
            fill="none"
            aria-hidden="true"
            focusable="false"
        >
            <path
                d="M6 4C62 26 178 26 234 4"
                stroke="currentColor"
                strokeWidth="1.2"
                opacity="0.9"
            />
            <circle cx="6" cy="4" r="1.9" fill="currentColor" />
            <circle cx="234" cy="4" r="1.9" fill="currentColor" />
            {TORAN_DROPS.map((d) => (
                <g key={d.x} transform={`translate(${d.x} ${d.y}) scale(${d.scale})`}>
                    <path d="M0 0v2.6" stroke="currentColor" strokeWidth={1 / d.scale} />
                    {d.buta ? (
                        <path
                            d="M1 2.2C3 5.2 3.6 7.6 3.6 10c0 2-1.6 3.6-3.6 3.6S-3.6 12-3.6 10c0-3 2.6-5 4.6-7.8z"
                            stroke="currentColor"
                            strokeWidth={1.35 / d.scale}
                        />
                    ) : (
                        <path
                            d="M0 2.4c3.3 2.8 3.5 7.4 0 11.2-3.5-3.8-3.3-8.4 0-11.2z"
                            fill="currentColor"
                        />
                    )}
                </g>
            ))}
            <circle cx="120" cy="30.5" r="2" fill="currentColor" />
        </svg>
    );
}

function getTriviaVerdict(score: number, total: number): string {
    const ratio = total > 0 ? score / total : 0;
    if (ratio >= 1) return 'Have you been reading their diary?!';
    if (ratio >= 0.7) return 'The family detective 🕵️';
    if (ratio >= 0.4) return 'Distant-relative level — brush up!';
    return 'Only here for the food? 😄';
}

function DastakTriviaSection({
    partnerOne,
    partnerTwo,
}: {
    partnerOne: string;
    partnerTwo: string;
}) {
    const headingId = useId();
    const cardRef = useRef<HTMLDivElement | null>(null);
    const timerRef = useRef<number | null>(null);

    const questions: TriviaQuestion[] = useMemo(
        () => [
            {
                id: 'pehli-mulaqat',
                prompt: 'Where did they first meet?',
                options: [
                    'At home, in front of both families',
                    'At college or at work',
                    "At a friend's party",
                    'Online — with one message',
                ],
                answer: 1,
            },
            {
                id: 'rishta-kaise',
                prompt: 'How did it happen — friends, family or fate?',
                options: [
                    'The families introduced them',
                    'Friends set them up',
                    'They met on their own',
                    'Through work',
                ],
                answer: 2,
            },
            {
                id: 'alarm-snooze',
                prompt: 'Who snoozes the morning alarm five times?',
                options: [
                    partnerOne,
                    partnerTwo,
                    'Both of them',
                    'Neither — they are both early risers',
                ],
                answer: 0,
            },
            {
                id: 'chai-kaun',
                prompt: 'Who makes the morning tea?',
                options: [
                    partnerOne,
                    partnerTwo,
                    'They take turns',
                    'Neither — they both drink coffee',
                ],
                answer: 1,
            },
            {
                id: 'zyada-filmy',
                prompt: 'Who is more dramatic?',
                options: [partnerOne, partnerTwo, 'Equally both', "That's a secret 🤫"],
                answer: 0,
            },
            {
                id: 'hamesha-late',
                prompt: 'Who is always running late?',
                options: [
                    partnerOne,
                    partnerTwo,
                    'Both of them',
                    'Neither — they are always on time',
                ],
                answer: 1,
            },
            {
                id: 'dance-floor',
                prompt: 'Who gets to the dance floor first?',
                options: [partnerOne, partnerTwo, 'Both together', 'Both will need a push'],
                answer: 3,
            },
        ],
        [partnerOne, partnerTwo]
    );

    const [activeSide, setActiveSide] = useState<0 | 1 | null>(null);
    const [qIndex, setQIndex] = useState(0);
    const [pickedOption, setPickedOption] = useState<number | null>(null);
    const [results, setResults] = useState<boolean[]>([]);
    const [finished, setFinished] = useState(false);
    const [displayScore, setDisplayScore] = useState(0);
    const [copied, setCopied] = useState(false);

    const clearStepTimer = useCallback(() => {
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const closeSheet = useCallback(() => {
        clearStepTimer();
        setActiveSide(null);
    }, [clearStepTimer]);

    const startSide = (side: 0 | 1) => {
        clearStepTimer();
        setQIndex(0);
        setPickedOption(null);
        setResults([]);
        setFinished(false);
        setDisplayScore(0);
        setCopied(false);
        setActiveSide(side);
    };

    const advanceQuestion = useCallback(() => {
        clearStepTimer();
        setPickedOption(null);
        setQIndex((prev) => {
            if (prev + 1 >= questions.length) {
                setFinished(true);
                return prev;
            }
            return prev + 1;
        });
    }, [clearStepTimer, questions.length]);

    const score = results.filter(Boolean).length;
    const total = questions.length;
    const sideLabel = activeSide === 1 ? 'Ladkewale' : 'Ladkiwale';
    const currentQ = questions[qIndex];

    useEffect(() => {
        if (!finished) return;
        let raf = 0;
        const t0 = performance.now();
        const animateScore = (now: number) => {
            const p = Math.min(1, (now - t0) / 900);
            setDisplayScore(Math.round((1 - Math.pow(1 - p, 3)) * score));
            if (p < 1) raf = window.requestAnimationFrame(animateScore);
        };
        raf = window.requestAnimationFrame(animateScore);
        return () => window.cancelAnimationFrame(raf);
    }, [finished, score]);

    useEffect(() => {
        if (activeSide === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeSheet();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [activeSide, closeSheet]);

    const PIPS = ['A', 'B', 'C', 'D'];

    return (
        <div className={`${TRIVIA_CSS.card} ${TRIVIA_CSS.cardBare}`} ref={cardRef}>
            <TriviaToranSvg />
            <p className={TRIVIA_CSS.eyebrow}>Kitna Jaante Ho?</p>
            <h2 className={TRIVIA_CSS.heading} id={headingId}>
                Ladkiwale vs Ladkewale
            </h2>
            <p className={TRIVIA_CSS.subline}>
                {total} questions. Two sides of the family. One winner.
            </p>
            <div className={TRIVIA_CSS.sides}>
                <button
                    type="button"
                    className={`${TRIVIA_CSS.side} ${TRIVIA_CSS.sideOne}`}
                    onClick={() => startSide(0)}
                >
                    <span className={TRIVIA_CSS.sidePip} aria-hidden="true" />
                    <span className={TRIVIA_CSS.sideName}>Ladkiwale</span>
                    <span className={TRIVIA_CSS.sideFor}>Playing for {partnerOne}</span>
                </button>
                <span className={TRIVIA_CSS.vs} aria-hidden="true">
                    vs
                </span>
                <button
                    type="button"
                    className={`${TRIVIA_CSS.side} ${TRIVIA_CSS.sideTwo}`}
                    onClick={() => startSide(1)}
                >
                    <span className={TRIVIA_CSS.sidePip} aria-hidden="true" />
                    <span className={TRIVIA_CSS.sideName}>Ladkewale</span>
                    <span className={TRIVIA_CSS.sideFor}>Playing for {partnerTwo}</span>
                </button>
            </div>
            <p className={TRIVIA_CSS.teaser}>Be the first to play ✨</p>

            {activeSide !== null &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        className={`${TRIVIA_CSS.sheet} dastak-root`}
                        style={{ position: 'fixed', inset: 0 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Kitna Jaante Ho?"
                    >
                        <div className={TRIVIA_CSS.panel}>
                            <div className={TRIVIA_CSS.topBar}>
                                <span className={TRIVIA_CSS.topLines}>
                                    <span className={TRIVIA_CSS.sheetName}>Kitna Jaante Ho?</span>
                                    <span className={TRIVIA_CSS.progress}>
                                        {finished ? 'Your score' : `Question ${qIndex + 1} / ${total}`}
                                    </span>
                                </span>
                                <button
                                    type="button"
                                    className={TRIVIA_CSS.close}
                                    onClick={closeSheet}
                                    aria-label="Close the game"
                                >
                                    <svg
                                        viewBox="0 0 20 20"
                                        width="18"
                                        height="18"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M5 5l10 10M15 5L5 15"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div
                                className={`${TRIVIA_CSS.body} ${
                                    finished ? TRIVIA_CSS.bodyResult : ''
                                }`}
                            >
                                <div className={TRIVIA_CSS.dots} aria-hidden="true">
                                    {questions.map((q, idx) => (
                                        <span
                                            key={q.id}
                                            className={`${TRIVIA_CSS.dot} ${
                                                results[idx] === true
                                                    ? TRIVIA_CSS.dotRight
                                                    : results[idx] === false
                                                    ? TRIVIA_CSS.dotWrong
                                                    : ''
                                            }`}
                                        />
                                    ))}
                                </div>
                                {finished ? (
                                    <div className={TRIVIA_CSS.result}>
                                        <p className={TRIVIA_CSS.score}>
                                            {displayScore}
                                            <span className={TRIVIA_CSS.scoreTotal}>/{total}</span>
                                        </p>
                                        <p className={TRIVIA_CSS.verdict}>
                                            {getTriviaVerdict(score, total)}
                                        </p>
                                        <p className={TRIVIA_CSS.tally}>
                                            +{score} for {sideLabel}
                                        </p>
                                        <p className={TRIVIA_CSS.previewNote}>
                                            (Preview — scores are recorded once the site is live.)
                                        </p>
                                        <div className={TRIVIA_CSS.actions}>
                                            <button
                                                type="button"
                                                className={TRIVIA_CSS.primary}
                                                onClick={() => {
                                                    const shareText = `I scored ${score}/${total} in ${partnerOne} & ${partnerTwo}'s "Kitna Jaante Ho" — playing for ${sideLabel}! How well do you know them?`;
                                                    const waUrl = `https://wa.me/?text=${encodeURIComponent(
                                                        shareText
                                                    )}`;
                                                    if (
                                                        !window.open(
                                                            waUrl,
                                                            '_blank',
                                                            'noopener,noreferrer'
                                                        )
                                                    ) {
                                                        navigator.clipboard
                                                            ?.writeText(shareText)
                                                            .then(() => {
                                                                setCopied(true);
                                                                window.setTimeout(
                                                                    () => setCopied(false),
                                                                    2400
                                                                );
                                                            });
                                                    }
                                                }}
                                            >
                                                {copied ? 'Copied!' : 'Share on WhatsApp'}
                                            </button>
                                            <button
                                                type="button"
                                                className={TRIVIA_CSS.ghost}
                                                onClick={closeSheet}
                                            >
                                                Back to the invitation
                                            </button>
                                        </div>
                                    </div>
                                ) : currentQ ? (
                                    <>
                                        <p className={TRIVIA_CSS.prompt}>{currentQ.prompt}</p>
                                        <div className={TRIVIA_CSS.options}>
                                            {currentQ.options.map((opt, idx) => {
                                                const answered = pickedOption !== null;
                                                const isRight = idx === currentQ.answer;
                                                const isWrongPick =
                                                    answered && pickedOption === idx && !isRight;
                                                return (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        className={[
                                                            TRIVIA_CSS.option,
                                                            answered && isRight
                                                                ? TRIVIA_CSS.optionRight
                                                                : '',
                                                            isWrongPick ? TRIVIA_CSS.optionWrong : '',
                                                            answered && pickedOption === idx
                                                                ? TRIVIA_CSS.optionPulse
                                                                : '',
                                                        ]
                                                            .filter(Boolean)
                                                            .join(' ')}
                                                        disabled={answered}
                                                        onClick={() => {
                                                            if (pickedOption !== null) return;
                                                            const correct = idx === currentQ.answer;
                                                            setPickedOption(idx);
                                                            setResults((prev) => [...prev, correct]);
                                                            timerRef.current = window.setTimeout(
                                                                advanceQuestion,
                                                                750
                                                            );
                                                        }}
                                                    >
                                                        <span
                                                            className={TRIVIA_CSS.pip}
                                                            aria-hidden="true"
                                                        >
                                                            {answered && isRight ? (
                                                                <svg
                                                                    viewBox="0 0 16 16"
                                                                    width="14"
                                                                    height="14"
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        d="M3 8.4l3.2 3.2L13 4.8"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                            ) : isWrongPick ? (
                                                                <svg
                                                                    viewBox="0 0 16 16"
                                                                    width="13"
                                                                    height="13"
                                                                    fill="none"
                                                                >
                                                                    <path
                                                                        d="M4 4l8 8M12 4l-8 8"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                    />
                                                                </svg>
                                                            ) : (
                                                                PIPS[idx]
                                                            )}
                                                        </span>
                                                        <span className={TRIVIA_CSS.optionText}>
                                                            {opt}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <p
                                            className={`${TRIVIA_CSS.verdictLine} ${
                                                pickedOption === null
                                                    ? ''
                                                    : pickedOption === currentQ.answer
                                                    ? TRIVIA_CSS.verdictRight
                                                    : TRIVIA_CSS.verdictWrong
                                            }`}
                                            role="status"
                                        >
                                            {pickedOption === null
                                                ? ''
                                                : pickedOption === currentQ.answer
                                                ? 'Correct!'
                                                : 'Not quite!'}
                                        </p>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}

/* ============================================================================
   7. Gallery Jharokha Wall & Lightbox (Module 15404 — `K`, `J`, `Y`)
   ============================================================================ */

function JharokhaWindow({
    src,
    index,
    alt,
    onZoom,
}: {
    src: string | null;
    index: number;
    alt: string;
    onZoom: (idx: number, btn: HTMLButtonElement) => void;
}) {
    const revealMarkRef = useRef<HTMLSpanElement | null>(null);
    const [canAnimate, setCanAnimate] = useState(false);
    const [opened, setOpened] = useState(false);
    const [mounted, setMounted] = useState(false);
    const isOpen = !canAnimate || opened;

    useLayoutEffect(() => {
        setMounted(true);
        if (src && !prefersReducedMotion()) setCanAnimate(true);
    }, [src]);

    useLayoutEffect(() => {
        if (!canAnimate || opened) return;
        const mark = revealMarkRef.current;
        if (!mark) return;
        if (typeof IntersectionObserver === 'undefined') {
            setOpened(true);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setOpened(true);
                    io.disconnect();
                }
            },
            { rootMargin: '100000px 0px -10% 0px' }
        );
        io.observe(mark);
        return () => io.disconnect();
    }, [canAnimate, opened]);

    const actionMode = isOpen ? (src && mounted ? 'zoom' : null) : 'open';
    const num = index + 1;

    return (
        <article className={R.jharokha}>
            <span className={R.jGarland} aria-hidden="true">
                <img
                    src={`${ART_BASE}/garland-string.webp`}
                    alt=""
                    width={84}
                    height={800}
                    loading="lazy"
                />
            </span>
            <div className={R.jStage} data-open={isOpen ? '' : undefined}>
                <span className={R.revealMark} ref={revealMarkRef} aria-hidden="true" />
                <div className={R.jAperture}>
                    {src ? (
                        <img className={R.jPhoto} src={src} alt={alt} loading="lazy" />
                    ) : (
                        <span className={R.jEmpty} aria-hidden="true">
                            <span className={R.diamond} />
                        </span>
                    )}
                    <span className={R.jGlow} aria-hidden="true" />
                    <div className={R.jShutters} aria-hidden="true">
                        <div className={`${R.jShutter} ${R.jShutterLeft}`}>
                            <img
                                className={R.jShutterArt}
                                src={`${ART_BASE}/jharokha-shutter-left.webp`}
                                alt=""
                                width={200}
                                height={800}
                                loading="lazy"
                            />
                            <span className={R.jShutterShade} />
                        </div>
                        <div className={`${R.jShutter} ${R.jShutterRight}`}>
                            <img
                                className={R.jShutterArt}
                                src={`${ART_BASE}/jharokha-shutter-right.webp`}
                                alt=""
                                width={200}
                                height={800}
                                loading="lazy"
                            />
                            <span className={R.jShutterShade} />
                        </div>
                    </div>
                </div>
                <img
                    className={R.jFrame}
                    src={`${ART_BASE}/jharokha-frame.webp`}
                    alt=""
                    aria-hidden="true"
                    width={720}
                    height={1080}
                    loading="lazy"
                />
                <span className={`${R.jDiya} ${R.jDiyaLeft}`} aria-hidden="true">
                    <span className={R.jDiyaGlow} />
                    <img
                        className={R.jDiyaArt}
                        src={`${ART_BASE}/diya.webp`}
                        alt=""
                        width={240}
                        height={196}
                        loading="lazy"
                    />
                </span>
                <span className={`${R.jDiya} ${R.jDiyaRight}`} aria-hidden="true">
                    <span className={R.jDiyaGlow} />
                    <img
                        className={R.jDiyaArt}
                        src={`${ART_BASE}/diya.webp`}
                        alt=""
                        width={240}
                        height={196}
                        loading="lazy"
                    />
                </span>
                {actionMode ? (
                    <button
                        type="button"
                        className={R.jTap}
                        aria-label={
                            actionMode === 'open'
                                ? `Open the shutters on photo ${num}`
                                : `Photo ${num} — tap to enlarge`
                        }
                        onClick={(e) => {
                            if (actionMode === 'open') setOpened(true);
                            else onZoom(index, e.currentTarget);
                        }}
                    />
                ) : null}
            </div>
        </article>
    );
}

function JharokhaGalleryWall({
    frames,
    altForIndex,
}: {
    frames: Array<string | null>;
    altForIndex: (idx: number) => string;
}) {
    const wallRef = useRef<HTMLDivElement | null>(null);
    const triggerBtnRef = useRef<HTMLButtonElement | null>(null);
    const [activeIdx, setActiveIdx] = useState<number | null>(null);

    const openZoom = useCallback((idx: number, btn: HTMLButtonElement) => {
        triggerBtnRef.current = btn;
        setActiveIdx(idx);
    }, []);

    const closeZoom = useCallback(() => {
        setActiveIdx(null);
        window.requestAnimationFrame(() => triggerBtnRef.current?.focus({ preventScroll: true }));
    }, []);

    useEffect(() => {
        if (activeIdx === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                closeZoom();
            }
        };
        document.addEventListener('keydown', onKey, true);
        return () => document.removeEventListener('keydown', onKey, true);
    }, [activeIdx, closeZoom]);

    const activeSrc = activeIdx !== null ? frames[activeIdx] : null;

    return (
        <div className={R.jWall} ref={wallRef}>
            <div className={R.jWallInner}>
                {frames.map((src, idx) => (
                    <JharokhaWindow
                        key={idx}
                        src={src}
                        index={idx}
                        alt={altForIndex(idx)}
                        onZoom={openZoom}
                    />
                ))}
            </div>
            {activeIdx !== null &&
                activeSrc &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        className={`${R.jLightbox} dastak-root`}
                        style={{ position: 'fixed', inset: 0 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label={altForIndex(activeIdx)}
                    >
                        <button
                            type="button"
                            className={R.jLightScrim}
                            tabIndex={-1}
                            aria-hidden="true"
                            onClick={closeZoom}
                        />
                        <img
                            className={R.jLightPhoto}
                            src={activeSrc}
                            alt={altForIndex(activeIdx)}
                        />
                        <button
                            type="button"
                            className={R.jLightClose}
                            onClick={closeZoom}
                            aria-label="Close photo"
                        >
                            <svg
                                viewBox="0 0 20 20"
                                width="18"
                                height="18"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M5 5l10 10M15 5L5 15"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>,
                    document.body
                )}
        </div>
    );
}

/* ============================================================================
   8. Dastak Music Toggle (Module 49963 — `we-music-toggle`)
   ============================================================================ */

function DastakMusicToggle({ src }: { src: string }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const startedRef = useRef(false);
    const armedRef = useRef(false);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        const arm = () => {
            const audio = audioRef.current;
            if (!audio || armedRef.current || startedRef.current) return;
            armedRef.current = true;
            audio.volume = 0;
            audio
                .play()
                .then(() => {
                    if (!startedRef.current) {
                        audio.pause();
                        audio.currentTime = 0;
                    }
                })
                .catch(() => {
                    armedRef.current = false;
                });
        };

        const playWithRamp = (e: Event) => {
            const audio = audioRef.current;
            if (!audio || startedRef.current) return;
            const rampMs = (e as CustomEvent)?.detail?.rampMs ?? 1600;
            startedRef.current = true;
            audio.volume = 0;
            audio
                .play()
                .then(() => {
                    setPlaying(true);
                    const t0 = performance.now();
                    const step = () => {
                        const p = rampMs > 0 ? Math.min(1, (performance.now() - t0) / rampMs) : 1;
                        if (audioRef.current) audioRef.current.volume = 0.55 * p;
                        if (p < 1) requestAnimationFrame(step);
                    };
                    step();
                })
                .catch(() => {
                    startedRef.current = false;
                });
        };

        window.addEventListener('wed:music-arm', arm);
        window.addEventListener('wed:music-play', playWithRamp);
        return () => {
            window.removeEventListener('wed:music-arm', arm);
            window.removeEventListener('wed:music-play', playWithRamp);
            audioRef.current?.pause();
        };
    }, []);

    return (
        <>
            <audio
                ref={audioRef}
                src={src}
                loop
                preload="none"
                onEnded={() => {
                    startedRef.current = false;
                    setPlaying(false);
                }}
            />
            <button
                type="button"
                className={`we-music-toggle${playing ? ' is-playing' : ''}`}
                onClick={() => {
                    const audio = audioRef.current;
                    if (!audio) return;
                    if (playing) {
                        startedRef.current = false;
                        audio.pause();
                        setPlaying(false);
                    } else {
                        startedRef.current = true;
                        audio.volume = 0.55;
                        audio
                            .play()
                            .then(() => setPlaying(true))
                            .catch(() => {
                                startedRef.current = false;
                                setPlaying(false);
                            });
                    }
                }}
                aria-label={playing ? 'Pause background music' : 'Play background music'}
                aria-pressed={playing}
                title={playing ? 'Pause music' : 'Play music'}
            >
                {playing ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                        <rect x="6" y="5" width="4" height="14" rx="1" />
                        <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </button>
        </>
    );
}

/* ============================================================================
   Main Template Export — RoyalHeritageTemplate (Dastak 100% Replica)
   ============================================================================ */

export default function RoyalHeritageTemplate({ wedding, isPreview = false }: WebsiteTemplateProps) {
    const data = useWeddingTemplateData(wedding, isPreview);
    const siteRef = useRef<HTMLDivElement | null>(null);
    const heroVideoRef = useRef<HTMLVideoElement | null>(null);

    const [copiedAddr, setCopiedAddr] = useState(false);
    const [arrived, setArrived] = useState(false);
    const [canPlayHeroVideo, setCanPlayHeroVideo] = useState(false);
    const [heroLayout, setHeroLayout] = useState<'desktop' | 'mobile' | null>(null);
    const [canShowAmbient, setCanShowAmbient] = useState(false);
    const [rsvpDroppedMarigold, setRsvpDroppedMarigold] = useState(false);

    // Map couple names (Dastak default: Anaya & Ishaan; uses dynamic wedding names when provided)
    const rawBride = cleanText(wedding?.brideName);
    const rawGroom = cleanText(wedding?.groomName);
    const partnerOne = rawBride && rawBride !== 'Bride' ? rawBride : 'Anaya';
    const partnerTwo = rawGroom && rawGroom !== 'Groom' ? rawGroom : 'Ishaan';
    const coupleLabel = `${partnerOne} & ${partnerTwo}`;
    const monoFirst = partnerOne.charAt(0).toUpperCase() || 'A';
    const monoSecond = partnerTwo.charAt(0).toUpperCase() || 'I';

    const isoDate = useMemo(() => toIsoDate(data.primaryDateStr, '2027-05-14'), [data.primaryDateStr]);
    const locationLabel = data.venueCity || data.venueLocation || 'The Courtyard Haveli';
    const mainVenueName =
        data.hasVenue && data.venueLocation
            ? data.venueLocation.split(',')[0].trim()
            : 'The Grand Ballroom';
    const fullVenueAddress =
        data.hasVenue && data.venueLocation
            ? data.venueLocation
            : `${mainVenueName}, ${locationLabel}`;

    const heroPoem =
        cleanText((wedding as any)?.tagline) ||
        'One door, two families, and a lifetime on the other side of it.';

    const invitationCopy =
        data.invitationMessage ||
        'Together with our families, we invite you to join us as we begin our life together. Your presence, your laughter and your blessings are all we could wish for on this day.';

    const brideParentsText =
        data.brideParentsFormatted || 'Mr. Rajesh Sharma & Mrs. Sunita Sharma';
    const groomParentsText =
        data.groomParentsFormatted || 'Mr. Anil Verma & Mrs. Meena Verma';
    const familyBlessing =
        cleanText((wedding as any)?.blessing) ||
        'With the love and blessings of our parents and elders, we step into this new chapter together.';

    // Map ceremonies (preserving customer events and ensuring Dastak's rich alcoves & dress codes)
    const dastakEvents: DastakEventItem[] = useMemo(() => {
        const rawList = Array.isArray(wedding?.events) ? wedding.events : [];
        if (rawList.length > 0) {
            return data.events.map((evt, idx) => {
                const lower = evt.displayTitle.toLowerCase();
                let defaultColors = ['#F6E8CE', '#D9B98A'];
                let defaultDesc = 'The wedding ceremony at the gate, followed by dinner together.';
                if (lower.includes('mehendi') || lower.includes('mehndi') || lower.includes('henna')) {
                    defaultColors = ['#7A8450', '#E8862A'];
                    defaultDesc = 'An afternoon of henna, music and quiet celebration.';
                } else if (lower.includes('haldi') || lower.includes('pithi')) {
                    defaultColors = ['#E3B23C', '#F6E8CE'];
                    defaultDesc = 'Blessings of golden turmeric, marigold petals, and joyful laughter.';
                } else if (lower.includes('sangeet') || lower.includes('cocktail')) {
                    defaultColors = ['#5A1B26', '#C9962E'];
                    defaultDesc = 'An evening of songs and dancing with everyone we love.';
                } else if (lower.includes('reception')) {
                    defaultColors = ['#43121C', '#C9962E'];
                    defaultDesc = 'An evening of royal dinner, toasts, and celebration.';
                }
                return {
                    name: evt.displayTitle,
                    date: toIsoDate(evt.date, isoDate),
                    time: evt.time || (idx === 0 ? '16:00' : idx === 1 ? '19:30' : '19:00'),
                    venue: evt.hasVenueLocation ? evt.venueText : 'The Inner Courtyard',
                    desc: evt.description || defaultDesc,
                    dressCodeColors:
                        (evt as any).dressCodeColors && Array.isArray((evt as any).dressCodeColors)
                            ? (evt as any).dressCodeColors
                            : defaultColors,
                    mapsLink: evt.mapLink || undefined,
                };
            });
        }

        return [
            {
                name: 'Mehendi',
                date: '2027-05-12',
                time: '16:00',
                venue: 'The Inner Courtyard',
                desc: 'An afternoon of henna, music and quiet celebration.',
                dressCodeColors: ['#7A8450', '#E8862A'],
            },
            {
                name: 'Sangeet',
                date: '2027-05-13',
                time: '19:30',
                venue: 'The Lamp-lit Terrace',
                desc: 'An evening of songs and dancing with everyone we love.',
                dressCodeColors: ['#5A1B26', '#C9962E'],
            },
            {
                name: 'Wedding',
                date: '2027-05-14',
                time: '19:00',
                venue: 'The Deodhi Gate',
                desc: 'The wedding ceremony at the gate, followed by dinner together.',
                dressCodeColors: ['#F6E8CE', '#D9B98A'],
            },
        ];
    }, [wedding?.events, data.events, isoDate]);

    const storyTitle = cleanText((wedding as any)?.storyTitle) || 'Our Story';
    const storyText =
        cleanText((wedding as any)?.story) ||
        cleanText((wedding as any)?.coupleStory) ||
        'We met through friends on an ordinary evening, and somewhere between long conversations and longer walks we stopped counting the days apart. With our families beside us, we are ready to begin — and we would love for you to be there when we do.';

    const galleryFrames: Array<string | null> = useMemo(() => {
        if (data.customGalleryImages.length > 0) {
            return data.customGalleryImages.slice(0, 4);
        }
        return [
            `${GALLERY_BASE}/engagement.webp`,
            `${GALLERY_BASE}/palace.webp`,
            `${GALLERY_BASE}/jhoola.webp`,
            `${GALLERY_BASE}/golden-hour.webp`,
        ];
    }, [data.customGalleryImages]);

    const hashtag =
        cleanText((wedding as any)?.hashtag) ||
        `#${partnerOne.replace(/\s+/g, '')}And${partnerTwo.replace(/\s+/g, '')}`;

    const guestInfoCards = useMemo(
        () => [
            {
                id: 'travel',
                label: 'Travel',
                value:
                    cleanText((wedding as any)?.travelInfo) ||
                    'The venue is an easy drive from the main road, and cabs are simple to find. Tell us if you need help planning your journey.',
            },
            {
                id: 'stay',
                label: 'Stay',
                value:
                    cleanText((wedding as any)?.accommodationInfo) ||
                    'We have held a block of rooms at a hotel close by — mention our names when you book for the group rate.',
            },
            {
                id: 'parking',
                label: 'Parking',
                value:
                    cleanText((wedding as any)?.parkingInfo) ||
                    'Parking is available at the gate and our team will guide you in when you arrive.',
            },
        ],
        [wedding]
    );

    const regardsPeople = useMemo(() => {
        const list: Array<{ name: string; phone: string; telHref: string }> = [
            {
                name: data.brideParentsFormatted ? data.brideParentsFormatted.split('&')[0].trim() : 'Mr. Rajesh Sharma',
                phone: data.rsvpContact || '98100 00000',
                telHref: `tel:${(data.rsvpContact || '9810000000').replace(/[^0-9+]/g, '')}`,
            },
            {
                name: 'Mrs. Sunita Sharma',
                phone: '98200 00000',
                telHref: 'tel:9820000000',
            },
            {
                name: data.groomParentsFormatted ? data.groomParentsFormatted.split('&')[0].trim() : 'Mr. Anil Verma',
                phone: '',
                telHref: '',
            },
        ];
        return list;
    }, [data.brideParentsFormatted, data.groomParentsFormatted, data.rsvpContact]);

    const footerCalLinks = useMemo(() => {
        const start = new Date(`${isoDate}T00:00:00`);
        if (Number.isNaN(start.getTime())) return null;
        const end = new Date(start.getTime() + 86400000);
        const fmt = (d: Date) =>
            `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
                d.getDate()
            ).padStart(2, '0')}`;
        const summary = `${partnerOne} weds ${partnerTwo}`;
        const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            summary
        )}&dates=${fmt(start)}/${fmt(end)}&location=${encodeURIComponent(fullVenueAddress)}`;
        const ics = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART;VALUE=DATE:${fmt(start)}`,
            `DTEND;VALUE=DATE:${fmt(end)}`,
            `SUMMARY:${summary}`,
            `LOCATION:${fullVenueAddress}`,
            'END:VEVENT',
            'END:VCALENDAR',
        ].join('\n');
        return {
            google,
            apple: `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`,
            title: summary,
        };
    }, [isoDate, partnerOne, partnerTwo, fullVenueAddress]);

    const ensureHeroVideoPlaying = useCallback(() => {
        const v = heroVideoRef.current;
        if (v && v.paused) {
            v.play().catch(() => undefined);
        }
    }, []);

    useLayoutEffect(() => {
        const red = prefersReducedMotion();
        setCanPlayHeroVideo(!red);
        setCanShowAmbient(!red);
        if (red) setArrived(true);
    }, []);

    // Portrait screens (phones) get the 9:16 hero video, landscape screens
    // (laptops, desktops, tablets on their side) get the 16:9 one. Re-checked on
    // rotate/resize so the picture always fills the screen sharply.
    useLayoutEffect(() => {
        const mq = window.matchMedia(HERO_PORTRAIT_QUERY);
        const pick = () => setHeroLayout(mq.matches ? 'mobile' : 'desktop');
        pick();
        mq.addEventListener('change', pick);
        return () => mq.removeEventListener('change', pick);
    }, []);

    useLayoutEffect(() => {
        if (!canPlayHeroVideo || !heroLayout) return;
        ensureHeroVideoPlaying();
        const onVis = () => {
            if (document.visibilityState === 'visible') ensureHeroVideoPlaying();
        };
        document.addEventListener('visibilitychange', onVis);
        return () => document.removeEventListener('visibilitychange', onVis);
    }, [canPlayHeroVideo, heroLayout, ensureHeroVideoPlaying]);

    useEffect(() => {
        if (data.step === 'SUCCESS' || data.step === 'ALREADY_REGISTERED') {
            setRsvpDroppedMarigold(true);
        }
    }, [data.step]);

    const audioTrackSrc =
        cleanText((wedding as any)?.audioUrl) ||
        cleanText((wedding as any)?.musicUrl) ||
        DEFAULT_DASTAK_AUDIO;

    const rsvpDone = rsvpDroppedMarigold || data.step === 'SUCCESS' || data.step === 'ALREADY_REGISTERED';

    return (
        <div
            ref={siteRef}
            className={`${R.site} dastak-root`}
            data-dk-armed={!arrived ? '' : undefined}
        >
            <WebsiteTemplateFonts />

            {/* 1. Opening Haveli Door Overlay */}
            <div className={R.overlays}>
                <DastakDoor
                    show={true}
                    doorMp4={`${OPENING_BASE}/door.mp4`}
                    doorPoster={`${OPENING_BASE}/door-poster.webp`}
                    hint="दस्तक दीजिए"
                    subHint="Knock to open"
                    openLabel="Knock to open the invitation"
                    onOpen={ensureHeroVideoPlaying}
                    onHandoff={() => {
                        setArrived(true);
                        requestAnimationFrame(ensureHeroVideoPlaying);
                    }}
                    backdrop="#2A1F17"
                />
            </div>

            {/* 2. Sticky Ambient Falling Petal Canvas */}
            {canShowAmbient ? (
                <div className={R.ambient} aria-hidden="true">
                    <div className={R.ambientField}>
                        <AmbientPetalCanvas />
                    </div>
                </div>
            ) : null}

            {/* 3. Hero Courtyard Stage */}
            <header className={R.hero} id="cover">
                <div className={R.heroStage} aria-hidden="true">
                    <picture>
                        <source media={HERO_PORTRAIT_QUERY} srcSet={`${HERO_BASE}/hero-mobile.webp`} />
                        <img
                            className={R.heroMedia}
                            src={`${HERO_BASE}/hero-desktop.webp`}
                            alt=""
                            fetchPriority="high"
                        />
                    </picture>
                    {canPlayHeroVideo && heroLayout ? (
                        <video
                            key={heroLayout}
                            ref={heroVideoRef}
                            className={R.heroMedia}
                            poster={`${HERO_BASE}/hero-${heroLayout}.webp`}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            disablePictureInPicture
                        >
                            <source src={`${HERO_BASE}/hero-${heroLayout}.webm`} type="video/webm" />
                            <source src={`${HERO_BASE}/hero-${heroLayout}.mp4`} type="video/mp4" />
                        </video>
                    ) : null}
                    <div className={R.heroVeil} />
                </div>

                <div className={R.heroCopy} data-arrived={arrived ? '' : undefined}>
                    <img
                        className={`${R.line} ${R.invocationEmblem}`}
                        src={`${ART_BASE}/ganesha.webp`}
                        alt=""
                        aria-hidden="true"
                        width={242}
                        height={240}
                        decoding="async"
                    />
                    <span className={`${R.line} ${R.invocationText}`}>
                        <span className={R.invocationLine}>॥ श्री गणेशाय नमः ॥</span>
                    </span>
                    <span className={`${R.line} ${R.eyebrow}`}>
                        We joyfully invite you to the wedding&nbsp;of
                    </span>
                    <Divider className={R.line} />
                    <h1 className={R.names}>
                        <span className={`${R.line} ${R.name}`}>{partnerOne}</span>{' '}
                        <span className={`${R.line} ${R.name} ${R.amp}`}>&amp;</span>{' '}
                        <span className={`${R.line} ${R.name}`}>{partnerTwo}</span>
                    </h1>
                    <time className={`${R.line} ${R.heroDate}`} dateTime={isoDate}>
                        {formatDastakDate(isoDate)}
                    </time>
                    <span className={`${R.line} ${R.heroPlace}`}>{locationLabel}</span>
                    <p className={`${R.line} ${R.heroPoem}`}>{heroPoem}</p>
                </div>

                <span className={R.scrollHint} aria-hidden="true">
                    Scroll
                </span>
            </header>

            {/* 4. Shubh Muhurat Interactive Rangoli Petal-Sweep Date Reveal */}
            <section className={`${R.section} ${R.muhuratSection}`} id="muhurat">
                <RevealOnScroll>
                    <h2 className={R.eyebrowDark}>
                        <span className={R.deva} lang="hi">
                            शुभ मुहूर्त
                        </span>
                        <span className={R.muhuratLatin}>Save the date</span>
                    </h2>
                </RevealOnScroll>
                <MuhuratRangoliSweep date={isoDate} />
            </section>

            {/* 5. Live Countdown Wall with Swinging Medallions & Ringing Bells */}
            <CountdownSection date={isoDate} />

            {/* 6. The Invitation Card */}
            <section className={R.section} id="invite">
                <RevealOnScroll>
                    <span className={R.deva}>॥ शुभ विवाह ॥</span>
                    <h2 className={R.eyebrowDark}>The invitation</h2>
                    <div className={R.card}>
                        <p className={R.inviteText}>{invitationCopy}</p>
                    </div>
                </RevealOnScroll>
            </section>

            {/* 7. With the Blessings of Our Families */}
            <section className={`${R.section} ${R.familySection}`} id="families">
                <RevealOnScroll>
                    <h2 className={R.eyebrowDark}>With the blessings of our families</h2>
                    <Divider />
                </RevealOnScroll>
                <RevealOnScroll delay={0.05}>
                    <div className={R.familyGrid}>
                        <div className={R.familyCard}>
                            <span>Daughter of</span>
                            <strong>{brideParentsText}</strong>
                        </div>
                        <div className={R.familyCard}>
                            <span>Son of</span>
                            <strong>{groomParentsText}</strong>
                        </div>
                    </div>
                    <p className={R.blessing}>{familyBlessing}</p>
                </RevealOnScroll>
            </section>

            {/* 8. Our Events — 3D Swinging Haveli Doorways & Emerging Chitthi Cards */}
            <section className={`${R.section} ${R.eventsSection}`} id="events">
                <RevealOnScroll>
                    <span className={R.eyebrowDark}>The celebrations</span>
                    <h2 className={R.heading}>Our Events</h2>
                    <Divider />
                </RevealOnScroll>
                <div className={R.events}>
                    {dastakEvents.map((evt, idx) => (
                        <EventDoorwayCard
                            key={`${evt.name}-${idx}`}
                            event={evt}
                            coupleLabel={coupleLabel}
                            fallbackLocation={locationLabel}
                        />
                    ))}
                </div>
            </section>

            {/* 9. Our Story */}
            <section className={`${R.section} ${R.storySection}`} id="story">
                <RevealOnScroll>
                    <h2 className={R.eyebrowDark}>{storyTitle}</h2>
                    <div className={R.card}>
                        <p className={R.storyText}>{storyText}</p>
                    </div>
                </RevealOnScroll>
            </section>

            {/* 10. Kitna Jaante Ho? — Ladkiwale vs Ladkewale Trivia Game */}
            <section className={R.section} id="trivia">
                <RevealOnScroll>
                    <div className={R.card}>
                        <DastakTriviaSection partnerOne={partnerOne} partnerTwo={partnerTwo} />
                    </div>
                </RevealOnScroll>
            </section>

            {/* 11. Moments — Our Gallery Jharokha Wall */}
            <section className={R.section} id="gallery">
                <RevealOnScroll>
                    <span className={R.eyebrowDark}>Moments</span>
                    <h2 className={R.heading}>Our Gallery</h2>
                    <Divider />
                </RevealOnScroll>
                <JharokhaGalleryWall
                    frames={galleryFrames}
                    altForIndex={(idx) => `${partnerOne} & ${partnerTwo}, photo ${idx + 1}`}
                />
            </section>

            {/* 12. Wedding Hashtag */}
            <section className={`${R.section} ${R.hashtagSection}`}>
                <RevealOnScroll>
                    <span className={R.eyebrowDark}>Tag your photos</span>
                    <p className={R.hashtag}>{hashtag}</p>
                </RevealOnScroll>
            </section>

            {/* 13. The Setting (Main Venue) */}
            <section className={`${R.section} ${R.venueSection}`}>
                <RevealOnScroll>
                    <span className={R.eyebrowDark}>The setting</span>
                    <h2 className={R.heading}>{mainVenueName}</h2>
                    <div className={R.card}>
                        <p className={R.venueAddr}>{fullVenueAddress}</p>
                        <div className={R.venueActions}>
                            <button
                                type="button"
                                className={R.copyBtn}
                                onClick={() => {
                                    navigator.clipboard?.writeText(fullVenueAddress).then(
                                        () => {
                                            setCopiedAddr(true);
                                            window.setTimeout(() => setCopiedAddr(false), 2200);
                                        },
                                        () => undefined
                                    );
                                }}
                            >
                                {copiedAddr ? 'Copied ✦' : 'Copy address'}
                            </button>
                            <a
                                className={R.copyBtn}
                                href={
                                    data.googleMapsLink ||
                                    `https://maps.google.com/?q=${encodeURIComponent(
                                        fullVenueAddress
                                    )}`
                                }
                                target="_blank"
                                rel="noreferrer"
                            >
                                Open map
                            </a>
                        </div>
                    </div>
                </RevealOnScroll>
            </section>

            {/* 14. Your Journey — For Our Guests */}
            <section className={R.section} id="travel">
                <RevealOnScroll>
                    <span className={R.eyebrowDark}>Your journey</span>
                    <h2 className={R.heading}>For our guests</h2>
                    <Divider />
                </RevealOnScroll>
                <div className={R.infoGrid}>
                    {guestInfoCards.map((card, idx) => (
                        <RevealOnScroll key={card.id} delay={0.06 * idx}>
                            <div className={R.infoCard}>
                                <span className={R.infoHead}>{card.label}</span>
                                <p>{card.value}</p>
                            </div>
                        </RevealOnScroll>
                    ))}
                </div>
            </section>

            {/* 15. Join the Celebration — Chitthi RSVP Card */}
            <section className={`${R.section} ${R.rsvpSection}`} id="rsvp">
                <RevealOnScroll>
                    <span className={R.eyebrowDark}>Join the celebration</span>
                    <h2 className={R.heading}>Will you join us?</h2>
                </RevealOnScroll>
                <div className={R.chitthiBand}>
                    <RevealOnScroll className={R.chitthiWrap}>
                        <img
                            className={`${R.chitthiPetal} ${R.chitthiPetalA}`}
                            src={`${ART_BASE}/petal-rose-1.webp`}
                            alt=""
                            aria-hidden="true"
                            width={96}
                            height={96}
                            loading="lazy"
                            decoding="async"
                        />
                        <img
                            className={`${R.chitthiPetal} ${R.chitthiPetalB}`}
                            src={`${ART_BASE}/petal-marigold-2.webp`}
                            alt=""
                            aria-hidden="true"
                            width={96}
                            height={96}
                            loading="lazy"
                            decoding="async"
                        />
                        <div className={R.chitthi}>
                            <span className={R.chitthiPaper} aria-hidden="true" />
                            <div className={R.chitthiInk}>
                                <span className={R.chitthiFlourish} aria-hidden="true" />
                                {!rsvpDone ? (
                                    <p className={R.rsvpIntro}>
                                        Please let us know if you can join us, so we can keep a place
                                        waiting for you.
                                    </p>
                                ) : null}
                                {rsvpDone ? (
                                    <div className="rsvp-form rsvp-done">
                                        <strong>
                                            {data.status === 'declined'
                                                ? "Thank you for letting us know — you'll be missed."
                                                : 'शुक्रिया — Shukriya! The lamps will be lit for you.'}
                                        </strong>
                                        {isPreview || wedding?.id === 'sample' ? (
                                            <small>
                                                (Preview — responses are recorded once the site is
                                                live.)
                                            </small>
                                        ) : null}
                                    </div>
                                ) : (
                                    <form
                                        className="rsvp-form"
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            if (!data.guestName.trim()) {
                                                data.setNameError(true);
                                                return;
                                            }
                                            if (isPreview || !wedding?.id || wedding.id === 'sample') {
                                                setRsvpDroppedMarigold(true);
                                                data.setStep('SUCCESS');
                                                return;
                                            }
                                            await data.handleSubmit(e);
                                            setRsvpDroppedMarigold(true);
                                        }}
                                    >
                                        <div
                                            className="rsvp-toggle"
                                            role="radiogroup"
                                            aria-label="Will you attend?"
                                        >
                                            <button
                                                type="button"
                                                role="radio"
                                                aria-checked={data.status !== 'declined'}
                                                className={data.status !== 'declined' ? 'active' : ''}
                                                onClick={() => data.setStatus('attending')}
                                            >
                                                Joyfully attending
                                            </button>
                                            <button
                                                type="button"
                                                role="radio"
                                                aria-checked={data.status === 'declined'}
                                                className={data.status === 'declined' ? 'active' : ''}
                                                onClick={() => data.setStatus('declined')}
                                            >
                                                Sadly, can&apos;t make it
                                            </button>
                                        </div>
                                        <label>
                                            Your name
                                            <input
                                                id="rsvp-guest-name"
                                                name="name"
                                                autoComplete="name"
                                                placeholder="Full name"
                                                required
                                                value={data.guestName}
                                                onChange={(e) => {
                                                    data.setGuestName(e.target.value);
                                                    if (data.nameError) data.setNameError(false);
                                                }}
                                            />
                                        </label>
                                        <div className="rsvp-row">
                                            <label>
                                                Phone (optional)
                                                <input
                                                    name="phone"
                                                    autoComplete="tel"
                                                    inputMode="tel"
                                                    placeholder="+91"
                                                    value={data.phone}
                                                    onChange={(e) => data.setPhone(e.target.value)}
                                                />
                                            </label>
                                            <label>
                                                Guests
                                                <select
                                                    name="count"
                                                    value={String(data.adultCount)}
                                                    disabled={data.status === 'declined'}
                                                    onChange={(e) => {
                                                        const target = Number(e.target.value) || 1;
                                                        const diff = target - data.adultCount;
                                                        if (diff > 0) {
                                                            for (let i = 0; i < diff; i++)
                                                                data.incrementGuests();
                                                        } else if (diff < 0) {
                                                            for (let i = 0; i < Math.abs(diff); i++)
                                                                data.decrementGuests();
                                                        }
                                                    }}
                                                >
                                                    {[1, 2, 3, 4, 5, 6].map((n) => (
                                                        <option key={n} value={n}>
                                                            {n}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                        </div>
                                        <label>
                                            A note for the couple (optional)
                                            <textarea
                                                name="note"
                                                rows={2}
                                                placeholder="Bahut saari shubhkamnayein!"
                                                value={data.message}
                                                onChange={(e) => data.setMessage(e.target.value)}
                                            />
                                        </label>
                                        {data.nameError ? (
                                            <p className="rsvp-error" role="alert">
                                                Please add your name.
                                            </p>
                                        ) : null}
                                        {data.submitError ? (
                                            <p className="rsvp-error" role="alert">
                                                {data.submitError}
                                            </p>
                                        ) : null}
                                        <button
                                            className="rsvp-submit"
                                            type="submit"
                                            disabled={data.isSubmitting}
                                        >
                                            {data.isSubmitting ? 'Sending...' : 'Send RSVP'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                        {rsvpDone ? (
                            <img
                                className={R.chitthiMarigold}
                                src={`${ART_BASE}/marigold-head-1.webp`}
                                alt=""
                                aria-hidden="true"
                                width={96}
                                height={96}
                                decoding="async"
                            />
                        ) : null}
                    </RevealOnScroll>
                </div>
            </section>

            {/* 16. With Warm Regards */}
            <section className={R.section} id="regards">
                <RevealOnScroll>
                    <div className={REGARDS_CSS.regards}>
                        <span className={REGARDS_CSS.rule} aria-hidden="true" />
                        <p className={REGARDS_CSS.heading}>With warm regards</p>
                        <p className={REGARDS_CSS.note}>
                            Awaiting your gracious presence — the Sharma &amp; Verma families
                        </p>
                        <ul className={REGARDS_CSS.people}>
                            {regardsPeople.map((person, idx) => (
                                <li key={`${person.name}-${idx}`} className={REGARDS_CSS.person}>
                                    <span className={REGARDS_CSS.name}>{person.name}</span>
                                    {person.telHref ? (
                                        <a
                                            className={REGARDS_CSS.phone}
                                            href={person.telHref}
                                            aria-label={`Call ${person.name}`}
                                        >
                                            {person.phone}
                                        </a>
                                    ) : null}
                                </li>
                            ))}
                        </ul>
                    </div>
                </RevealOnScroll>
            </section>

            {/* 17. Finale Footer */}
            <footer className={R.finale}>
                <RevealOnScroll>
                    <Diamond className={R.finaleDiamond} />
                    <span className={R.finaleMono}>
                        {monoFirst}
                        <span className={R.monoDot}>·</span>
                        {monoSecond}
                    </span>
                    <p className={R.finaleCopy}>
                        Our door is open, and the lamps are lit. We cannot wait to welcome you in.
                    </p>
                    <div className={R.finaleCtas}>
                        <button
                            type="button"
                            className={R.ctaPrimary}
                            onClick={() => {
                                siteRef.current?.querySelector('#rsvp')?.scrollIntoView({
                                    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                                    block: 'start',
                                });
                            }}
                        >
                            RSVP now
                        </button>
                        <button
                            type="button"
                            className={R.ctaGhost}
                            onClick={() => {
                                siteRef.current?.scrollIntoView({
                                    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                                    block: 'start',
                                });
                            }}
                        >
                            Back to top
                        </button>
                    </div>
                    <div className={R.finaleNames}>
                        {partnerOne} &amp; {partnerTwo} · {formatShortDots(isoDate)}
                    </div>
                    {footerCalLinks ? (
                        <div className={R.calRow}>
                            <a href={footerCalLinks.google} target="_blank" rel="noreferrer">
                                Google Calendar
                            </a>
                            <a
                                href={footerCalLinks.apple}
                                download={`${footerCalLinks.title}.ics`}
                            >
                                Apple / iCal
                            </a>
                        </div>
                    ) : null}
                    <span className={R.credit}>
                        Made with&nbsp;<span className={R.creditBrand}>Nimantran Studio</span>
                    </span>
                </RevealOnScroll>
            </footer>

            {/* Floating Dastak Audio Toggle */}
            <DastakMusicToggle src={audioTrackSrc} />
        </div>
    );
}
