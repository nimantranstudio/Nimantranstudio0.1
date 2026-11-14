'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { WebsiteTemplateProps } from '../types';
import { WebsiteTemplateFonts } from '../shared/fonts';
import { useWeddingTemplateData } from '../shared/useWeddingTemplateData';
import './saat-phere.css';

/* ==========================================================================
   CONSTANTS & CSS MODULE MAPPINGS (Exact Shagun Studio Saat Phere Modules)
   ========================================================================== */

const ART_BASE = '/website-templates/modern-romance/saat-phere/art';
const GALLERY_BASE = '/website-templates/modern-romance/saat-phere/gallery';
const DEFAULT_AUDIO_SRC = '/website-templates/modern-romance/saat-phere/saat-phere-audio.mp3';

const ARCH_RATIO = 1024 / 1536;
const PARDA_APERTURE = {
    left: 14.5,
    right: 85,
    top: 27.5,
    bottom: 89.5,
};

const PARDA_CLASSES = {
    root: 'parda_root__ok3qQ',
    rootFixed: 'parda_rootFixed__Kk3eR',
    stage: 'parda_stage__db_BC',
    aperture: 'parda_aperture__4uSW0',
    half: 'parda_half__8i7uT',
    halfLeft: 'parda_halfLeft__uV4DR',
    halfRight: 'parda_halfRight__XlWeI',
    sheet: 'parda_sheet__f1Ceh',
    pardaDrawLeft: 'parda_pardaDrawLeft__E73EU',
    pardaDrawRight: 'parda_pardaDrawRight__poeWa',
    pardaSwayLeft: 'parda_pardaSwayLeft__vU2Dn',
    pardaSwayRight: 'parda_pardaSwayRight__wdM9g',
    arch: 'parda_arch___6iLR',
    petals: 'parda_petals__RL1jn',
    rope: 'parda_rope__UmTe3',
    ropeLine: 'parda_ropeLine__jLWdi',
    pardaRopeSway: 'parda_pardaRopeSway__9QG1t',
    cord: 'parda_cord__SOwW_',
    tassel: 'parda_tassel__jEoLi',
    tasselArt: 'parda_tasselArt__nEfYt',
    tap: 'parda_tap__rnw3u',
    plate: 'parda_plate__ZVTBG',
    toLine: 'parda_toLine__QrSUP parda_plate__ZVTBG',
    hint: 'parda_hint__2rVRH parda_plate__ZVTBG',
    hintLine: 'parda_hintLine__EfNAp',
    pardaHintPulse: 'parda_pardaHintPulse__YI3ca',
    bloom: 'parda_bloom__CuGAG',
} as const;

const SP_CLASSES = {
    site: 'styles_site__6nk_f',
    overlays: 'styles_overlays__8cHQa',
    preloader: 'styles_preloader__WjEnH',
    band: 'styles_band__JwXka',
    eyebrow: 'styles_eyebrow__f_xQP',
    deva: 'styles_deva__C1AnM',
    eyebrowLatin: 'styles_eyebrowLatin__qzara',
    heading: 'styles_heading__gJ0f3',
    hero: 'styles_hero__Vrz_7',
    toran: 'styles_toran__fWi4P',
    toranSway: 'styles_toranSway__v4ElP',
    heroScene: 'styles_heroScene__7CXSl',
    scene: 'styles_scene__JSJeJ',
    cornerFloral: 'styles_cornerFloral__XytMf',
    petals: 'styles_petals__ovAiW',
    heroCopy: 'styles_heroCopy__kM0UZ',
    heroStack: 'styles_heroStack__p5h3I',
    heroKicker: 'styles_heroKicker__CLSV8',
    names: 'styles_names__R_8sU',
    nameLine: 'styles_nameLine__U7snQ',
    amp: 'styles_amp__Bnf6F',
    heroDate: 'styles_heroDate__jFVhr',
    heroWhen: 'styles_heroWhen___TQof',
    heroWhere: 'styles_heroWhere__vLfkU',
    heroTagline: 'styles_heroTagline__3PGyl',
    scrollHint: 'styles_scrollHint__SzR2a',
    hintPulse: 'styles_hintPulse__K8HhH',
    muhurat: 'styles_muhurat__CS7Iy styles_band__JwXka',
    muhuratStack: 'styles_muhuratStack__hbToF',
    plaquePanel: 'styles_plaquePanel__ceOOB',
    plaqueScratch: 'styles_plaqueScratch__q4HX2',
    plaque: 'styles_plaque___uM90',
    plaqueWeekday: 'styles_plaqueWeekday__UogqO',
    plaqueDay: 'styles_plaqueDay__3Iqqt',
    plaqueMonth: 'styles_plaqueMonth__r_mJY',
    plaqueRevealed: 'styles_plaqueRevealed__xlZw7',
    plaquePop: 'styles_plaquePop__P3C5T',
    muhuratHint: 'styles_muhuratHint__VR9ta',
    hintFaded: 'styles_hintFaded__DrF1o',
    muhuratPetals: 'styles_muhuratPetals__vMqzT',
    srOnly: 'styles_srOnly__UIAeo',
    countdownBand: 'styles_countdownBand__fn41w styles_band__JwXka',
    countdownStack: 'styles_countdownStack__7sNgG',
    countdownPulse: 'styles_countdownPulse__Rita0',
    countdownRing: 'styles_countdownRing__AG_JG',
    countdownSpin: 'styles_countdownSpin__eJBQg',
    countdown: 'styles_countdown__t1oVi',
    invite: 'styles_invite__9LmD0 styles_band__JwXka',
    inviteFloral: 'styles_inviteFloral__8HRnz',
    panel: 'styles_panel__22UNF',
    panelMotif: 'styles_panelMotif__PCXNm',
    inviteText: 'styles_inviteText__01A5j',
    families: 'styles_families__bDdrK styles_band__JwXka',
    familiesMotif: 'styles_familiesMotif__w1KRU',
    familyGrid: 'styles_familyGrid__9AyMa',
    familyCard: 'styles_familyCard__wmaT3',
    familyRole: 'styles_familyRole__HnIxU',
    familyName: 'styles_familyName__XqFBC',
    grandparents: 'styles_grandparents__7HzRC',
    familyKnot: 'styles_familyKnot__0f78_',
    blessing: 'styles_blessing__7KyCd',
    events: 'styles_events__ubIDr styles_band__JwXka',
    eventsToran: 'styles_eventsToran__P_uyv',
    eventList: 'styles_eventList__7scIx',
    eventCard: 'styles_eventCard__d4ryZ',
    eventSprig: 'styles_eventSprig__KwlfP',
    eventFrame: 'styles_eventFrame__h7Iye',
    eventMotif: 'styles_eventMotif__2J2h9',
    eventName: 'styles_eventName__T_gJL',
    eventWhen: 'styles_eventWhen__cx0_p',
    eventVenue: 'styles_eventVenue__ym1tc',
    eventDesc: 'styles_eventDesc__FZmMo',
    dress: 'styles_dress__ZHAKt',
    dressLabel: 'styles_dressLabel__KruDB',
    dressList: 'styles_dressList__wAQ56',
    dressChip: 'styles_dressChip__LqmQL',
    dressDot: 'styles_dressDot__nTg2F',
    eventActions: 'styles_eventActions__rG2DL',
    story: 'styles_story__2iete styles_band__JwXka',
    storyCouple: 'styles_storyCouple__l_4aA',
    storyText: 'styles_storyText__jscwB',
    storyTags: 'styles_storyTags__jM8rK',
    storyTag: 'styles_storyTag__Tt1KE',
    storyHashtag: 'styles_storyHashtag__o4h8O',
    gallery: 'styles_gallery__YeZrD styles_band__JwXka',
    galleryGrid: 'styles_galleryGrid__kGivW',
    frame: 'styles_frame__zjbPP',
    frameSpan: 'styles_frameSpan__tPHOq',
    frameZoom: 'styles_frameZoom__Pv7jn',
    framePlaceholder: 'styles_framePlaceholder__1F9ib',
    travel: 'styles_travel__ub4VP styles_band__JwXka',
    infoGrid: 'styles_infoGrid__0Dkk4',
    infoCard: 'styles_infoCard__KR9aM',
    infoHead: 'styles_infoHead__Oc15f',
    infoMaps: 'styles_infoMaps__YOIDy',
    venueRow: 'styles_venueRow__NkMR5',
    venueAddr: 'styles_venueAddr__Z9vkt',
    venueActions: 'styles_venueActions__Rx_Aw',
    ghostBtn: 'styles_ghostBtn__k6BKj',
    rsvp: 'styles_rsvp__fiYcK styles_band__JwXka',
    rsvpFloral: 'styles_rsvpFloral__a3dOO',
    rsvpCard: 'styles_rsvpCard__laatn',
    rsvpIntro: 'styles_rsvpIntro__yRl2C',
    rsvpLink: 'styles_rsvpLink__AEsTQ',
    finale: 'styles_finale__dGChC styles_band__JwXka',
    finaleToran: 'styles_finaleToran__gEHez',
    diyaLamp: 'styles_diyaLamp__qGw7Z',
    diyaFlicker: 'styles_diyaFlicker__kuwiw',
    hashtag: 'styles_hashtag__FMtN_',
    finaleNames: 'styles_finaleNames__WNBgy',
    finaleStamp: 'styles_finaleStamp__aZO91',
    calRow: 'styles_calRow__RAtrG',
    credit: 'styles_credit__Pr2ws',
    creditBrand: 'styles_creditBrand__no4rk',
    floatRsvp: 'styles_floatRsvp__ndmF1',
    floatSticky: 'styles_floatSticky__68u6S',
    floatFixed: 'styles_floatFixed__cBqwa',
    floatOpen: 'styles_floatOpen__ncy5z',
} as const;

const DECOR_CLASSES = {
    frame: 'decor_frame__Cb2sc',
    divider: 'decor_divider__tadpM',
} as const;

const MOTION_CLASSES = {
    srOnly: 'motion_srOnly__BurUg',
    decorEntrance: 'motion_decorEntrance__xAu08',
    decorEntranceRotate: 'motion_decorEntranceRotate__KP5WN',
    scratchRoot: 'motion_scratchRoot__pYuzO',
    scratchCanvas: 'motion_scratchCanvas__FXJIz',
    scratchCanvasGone: 'motion_scratchCanvasGone__zphIy',
    preloader: 'motion_preloader__Ec5fh',
    preloaderFixed: 'motion_preloaderFixed__j03lZ',
    preloaderLeaving: 'motion_preloaderLeaving__TQTx1',
    preloaderMonogram: 'motion_preloaderMonogram__TfOQY',
    preloaderBar: 'motion_preloaderBar__I4WRg',
    preloaderFill: 'motion_preloaderFill__XiLwt',
} as const;

const TRIVIA_CLASSES = {
    card: 'TriviaSection_card__BL_e6',
    sheet: 'TriviaSection_sheet__rwFQE',
    cardBare: 'TriviaSection_cardBare__Yh6pM',
    corner: 'TriviaSection_corner__lxePC',
    cornerTL: 'TriviaSection_cornerTL__ijAni',
    cornerTR: 'TriviaSection_cornerTR__Lf2DX',
    cornerBL: 'TriviaSection_cornerBL__VVg5P',
    cornerBR: 'TriviaSection_cornerBR___7U7Z',
    toran: 'TriviaSection_toran__p5p4_',
    eyebrow: 'TriviaSection_eyebrow__G4_6K',
    heading: 'TriviaSection_heading__42Icp',
    subline: 'TriviaSection_subline__VY4mf',
    sides: 'TriviaSection_sides__TjZE8',
    vs: 'TriviaSection_vs__JzJ5R',
    side: 'TriviaSection_side__Jr5Nh',
    sideOne: 'TriviaSection_sideOne__pwRco',
    sidePip: 'TriviaSection_sidePip__XVAR9',
    sideTwo: 'TriviaSection_sideTwo__7dWQ2',
    sideName: 'TriviaSection_sideName__ChIwK',
    sideFor: 'TriviaSection_sideFor__1Ii4_',
    teaser: 'TriviaSection_teaser__39Ttz',
    teaserSlot: 'TriviaSection_teaserSlot__qlqUh',
    challenge: 'TriviaSection_challenge__IgKYC',
    standings: 'TriviaSection_standings__x94fL',
    bar: 'TriviaSection_bar__wiCfu',
    barOne: 'TriviaSection_barOne__8_YJN',
    barTwo: 'TriviaSection_barTwo__DTuJH',
    barLabels: 'TriviaSection_barLabels__xtuTt',
    barLabelTwo: 'TriviaSection_barLabelTwo__4b74_',
    plays: 'TriviaSection_plays__qiH1y',
    panel: 'TriviaSection_panel__oJrf5',
    body: 'TriviaSection_body__yZVue',
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
    resultTitle: 'TriviaSection_resultTitle__liCeZ',
    score: 'TriviaSection_score__eDzd4',
    scoreTotal: 'TriviaSection_scoreTotal__tikF1',
    verdict: 'TriviaSection_verdict__XBbfU',
    tally: 'TriviaSection_tally__bDf8p',
    bodyResult: 'TriviaSection_bodyResult__aFlKd',
    nameRow: 'TriviaSection_nameRow__vueof',
    nameLabel: 'TriviaSection_nameLabel__7GFDO',
    nameField: 'TriviaSection_nameField__ywCKd',
    nameInput: 'TriviaSection_nameInput__6gz_d',
    nameSave: 'TriviaSection_nameSave__M_TjK',
    nameDone: 'TriviaSection_nameDone__t5Lf9',
    previewNote: 'TriviaSection_previewNote__PjisW',
    actions: 'TriviaSection_actions__CVruD',
    primary: 'TriviaSection_primary__rjW9B',
    ghost: 'TriviaSection_ghost__dmGuH',
    next: 'TriviaSection_next__Gal3f',
    indic: 'TriviaSection_indic__Ij73v',
} as const;

const REGARDS_CLASSES = {
    regards: 'RegardsSection_regards__s_woQ',
    rule: 'RegardsSection_rule__3XduN',
    eyebrow: 'RegardsSection_eyebrow__wL0B9',
    note: 'RegardsSection_note__C38gH',
    list: 'RegardsSection_list__r3feI',
    person: 'RegardsSection_person__l8z0L',
    name: 'RegardsSection_name__9_8w8',
    phone: 'RegardsSection_phone__tba0B',
    phoneIcon: 'RegardsSection_phoneIcon__4fc5e',
    indic: 'RegardsSection_indic__dfW2b',
} as const;

/* ==========================================================================
   SAAT PHERE THEME VARIABLES (Module 51930 + Module 44365)
   ========================================================================== */

const SAAT_PHERE_THEME_VARS: React.CSSProperties = {
    '--wed-page-bg': '#FBF3E4',
    '--wed-surface': '#FFFAF1',
    '--wed-surface-alt': '#FCE4E4',
    '--wed-ink': '#47161F',
    '--wed-ink-soft': '#6E4A50',
    '--wed-accent': '#A8325B',
    '--wed-accent-deep': '#8E2549',
    '--wed-gold': '#C9973B',
    '--wed-gold-soft': '#F2B33D',
    '--wed-frame-line': 'rgba(168, 50, 91, 0.28)',
    '--wed-scrim': 'rgba(71, 22, 31, 0.55)',
    '--wed-gold-text': '#7b5613',
    '--wed-on-accent': '#FFFAF1',
    '--wed-font-display': "'Rozha One', 'Playfair Display', Georgia, serif",
    '--wed-font-heading': "'Rozha One', 'Playfair Display', Georgia, serif",
    '--wed-font-label': "'Poppins', 'Helvetica Neue', Arial, sans-serif",
    '--wed-font-body': "'Poppins', 'Helvetica Neue', Arial, sans-serif",
    '--wed-font-script': "'Amita', 'Apple Chancery', cursive",
    '--wed-size-display': 'clamp(30px, 10.5cqw, 66px)',
    '--wed-size-heading': 'clamp(20px, 5.4cqw, 36px)',
    '--wed-size-label': 'clamp(10px, 2.7cqw, 13px)',
    '--wed-size-body': 'clamp(14px, 3.6cqw, 17px)',
    '--wed-size-script': 'clamp(22px, 6.4cqw, 40px)',
    '--wed-size-display-fb': '40.95px',
    '--wed-size-heading-fb': '21.06px',
    '--wed-size-label-fb': '10.53px',
    '--wed-size-body-fb': '14.04px',
    '--wed-size-script-fb': '24.96px',
    '--wed-ease-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
    '--wed-ease-in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
    '--wed-ease-soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
    '--wed-dur-fast': '180ms',
    '--wed-dur-base': '420ms',
    '--wed-dur-slow': '900ms',
    '--wed-dur-ceremonial': '1600ms',
    '--wed-space-xs': 'clamp(6px, 1.5cqw, 10px)',
    '--wed-space-sm': 'clamp(12px, 3cqw, 18px)',
    '--wed-space-md': 'clamp(20px, 5cqw, 32px)',
    '--wed-space-lg': 'clamp(36px, 9cqw, 64px)',
    '--wed-space-xl': 'clamp(56px, 14cqw, 104px)',
    '--wed-space-xs-fb': '5.85px',
    '--wed-space-sm-fb': '11.7px',
    '--wed-space-md-fb': '19.5px',
    '--wed-space-lg-fb': '35.1px',
    '--wed-space-xl-fb': '54.6px',
} as React.CSSProperties;

/* ==========================================================================
   SHAGUN STUDIO SAAT PHERE PREVIEW DEFAULTS
   ========================================================================== */

const DEFAULT_SAAT_PHERE_EVENTS = [
    {
        name: 'Mehendi',
        date: '2027-05-12',
        time: '16:00',
        venue: 'The Garden Terrace',
        desc: 'An afternoon of henna, cold drinks and quiet celebration.',
        dressCodeColors: ['#7A8450', '#E9A227'],
    },
    {
        name: 'Sangeet',
        date: '2027-05-13',
        time: '19:30',
        venue: 'The Banquet Lawn',
        desc: 'An evening of songs and dancing with everyone we love.',
        dressCodeColors: ['#1F6B70', '#C9A24B'],
    },
    {
        name: 'The Pheras',
        date: '2027-05-14',
        time: '08:00',
        venue: 'The Rose Courtyard',
        desc: 'Seven steps around the fire, at first light, with our families beside us.',
        dressCodeColors: ['#7A1F2B', '#C9A24B'],
    },
    {
        name: 'Reception',
        date: '2027-05-14',
        time: '20:00',
        venue: 'The Banquet Lawn',
        desc: 'Dinner, music and a very long evening of celebrating together.',
        dressCodeColors: ['#D98995', '#F1E8D7'],
    },
];

const DEFAULT_SAAT_PHERE_GALLERY = [
    `${GALLERY_BASE}/engagement.webp`,
    `${GALLERY_BASE}/palace.webp`,
    `${GALLERY_BASE}/jhoola.webp`,
    `${GALLERY_BASE}/golden-hour.webp`,
];

const DEFAULT_TRIVIA_QUESTIONS = (p1: string, p2: string) => [
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
            p1,
            p2,
            'Both of them',
            'Neither — they are both early risers',
        ],
        answer: 0,
    },
    {
        id: 'chai-kaun',
        prompt: 'Who makes the morning tea?',
        options: [
            p1,
            p2,
            'They take turns',
            'Neither — they both drink coffee',
        ],
        answer: 1,
    },
    {
        id: 'zyada-filmy',
        prompt: 'Who is more dramatic?',
        options: [
            p1,
            p2,
            'Equally both',
            "That's a secret 🤫",
        ],
        answer: 0,
    },
    {
        id: 'hamesha-late',
        prompt: 'Who is always running late?',
        options: [
            p1,
            p2,
            'Both of them',
            'Neither — they are always on time',
        ],
        answer: 1,
    },
    {
        id: 'dance-floor',
        prompt: 'Who gets to the dance floor first?',
        options: [
            p1,
            p2,
            'Both together',
            'Both will need a push',
        ],
        answer: 3,
    },
];

/* ==========================================================================
   DATE, CALENDAR, & HELPER FUNCTIONS (Modules 99126, 76668, 29111)
   ========================================================================== */

function parseLocalDate(str?: string): Date | null {
    if (!str) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str.trim());
    if (m) {
        const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
        return Number.isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(str);
    return Number.isNaN(d.getTime()) ? null : d;
}

function formatLongDate(str?: string): string {
    const d = parseLocalDate(str);
    return d
        ? d.toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : str || '';
}

function formatShortDate(str?: string): string {
    const d = parseLocalDate(str);
    return d
        ? d.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : str || '';
}

function formatTime12h(str?: string): string {
    if (!str) return '';
    const m = /^(\d{1,2}):(\d{2})$/.exec(str.trim());
    if (!m) return str;
    const h = Number(m[1]);
    const mins = m[2];
    if (Number.isNaN(h) || h < 0 || h > 23) return str;
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${mins} ${ampm}`;
}

function parseDateParts(str?: string) {
    const d = parseLocalDate(str);
    if (!d) return null;
    return {
        day: String(d.getDate()).padStart(2, '0'),
        month: d.toLocaleDateString('en-IN', { month: 'long' }),
        weekday: d.toLocaleDateString('en-IN', { weekday: 'long' }),
        year: String(d.getFullYear()),
    };
}

function parseEventDateTime(dateStr?: string, timeStr?: string): Date | null {
    if (!dateStr) return null;
    const cleanDate = dateStr.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
        const parsed = new Date(cleanDate);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    const cleanTime = timeStr && /^\d{2}:\d{2}$/.test(timeStr.trim()) ? timeStr.trim() : '11:00';
    const dt = new Date(`${cleanDate}T${cleanTime}:00`);
    return Number.isNaN(dt.getTime()) ? null : dt;
}

function toIcsUtcStamp(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}

function buildGoogleCalendarHref({
    title,
    date,
    time,
    location,
    description,
    durationHours = 3,
}: {
    title: string;
    date?: string;
    time?: string;
    location?: string;
    description?: string;
    durationHours?: number;
}): string {
    const start = parseEventDateTime(date, time);
    if (!start) return '#';
    const end = new Date(start.getTime() + durationHours * 3600000);
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        dates: `${toIcsUtcStamp(start)}/${toIcsUtcStamp(end)}`,
        details: description || '',
        location: location || '',
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildIcsHref({
    title,
    date,
    time,
    location,
    description,
    durationHours = 3,
}: {
    title: string;
    date?: string;
    time?: string;
    location?: string;
    description?: string;
    durationHours?: number;
}): string {
    const start = parseEventDateTime(date, time);
    if (!start) return '#';
    const end = new Date(start.getTime() + durationHours * 3600000);
    const esc = (s = '') => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, '\\$&');
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Nimantran Studio//Wedding//EN',
        'BEGIN:VEVENT',
        `UID:${start.getTime()}@nimantran.studio`,
        `DTSTAMP:${toIcsUtcStamp(new Date())}`,
        `DTSTART:${toIcsUtcStamp(start)}`,
        `DTEND:${toIcsUtcStamp(end)}`,
        `SUMMARY:${esc(title)}`,
        location ? `LOCATION:${esc(location)}` : '',
        description ? `DESCRIPTION:${esc(description)}` : '',
        'END:VEVENT',
        'END:VCALENDAR',
    ]
        .filter(Boolean)
        .join('\r\n');
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines)}`;
}

function buildGoogleMapsHref(query?: string): string {
    return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : '#';
}

function findScrollContainer(el: HTMLElement | null): HTMLElement | null {
    let cur = el?.parentElement ?? null;
    while (cur && cur !== document.body && cur !== document.documentElement) {
        const s = window.getComputedStyle(cur);
        const oy = s.overflowY;
        if ((oy === 'auto' || oy === 'scroll' || oy === 'overlay') && cur.clientHeight > 0) {
            return cur;
        }
        cur = cur.parentElement;
    }
    return null;
}

const DEFAULT_DRESS_SWATCHES: Record<string, string> = {
    '#7a1f2b': 'Maroon',
    '#8b1e24': 'Crimson',
    '#a23b2a': 'Sindoor',
    '#c65d3b': 'Terracotta',
    '#d97b29': 'Marigold',
    '#e9a227': 'Haldi yellow',
    '#c9a24b': 'Champagne gold',
    '#e5d3b3': 'Ivory gold',
    '#f6efe2': 'Ivory',
    '#f1e8d7': 'Cream',
    '#f5d6d0': 'Blush pink',
    '#e4a6b0': 'Rose pink',
    '#c94a6a': 'Rani pink',
    '#7a8450': 'Mehndi green',
    '#2f5d3a': 'Emerald',
    '#9bb09a': 'Sage',
    '#1d3557': 'Royal blue',
    '#0f1e36': 'Midnight navy',
    '#8fa6c9': 'Powder blue',
    '#1f6b70': 'Peacock teal',
    '#5a2a5e': 'Wine plum',
    '#b8a9c9': 'Lavender',
    '#2b2623': 'Charcoal',
};

function getSwatchLabel(item: string | { color: string; label?: string }): { color: string; label: string } {
    if (typeof item === 'string') {
        const c = item.trim();
        return {
            color: c,
            label: DEFAULT_DRESS_SWATCHES[c.toLowerCase()] || c,
        };
    }
    const c = item.color.trim();
    return {
        color: c,
        label: item.label?.trim() || DEFAULT_DRESS_SWATCHES[c.toLowerCase()] || c,
    };
}

function resolveCeremonyMotif(eventName: string): string {
    const lower = eventName.toLowerCase();
    if (/mehendi|mehndi|henna|sangeet|music|dance|cocktail|reception|dinner|party|nikah|walima/.test(lower)) {
        return `${ART_BASE}/motif-diya.webp`;
    }
    return `${ART_BASE}/motif-kalash.webp`;
}

/* ==========================================================================
   DECORATIVE & MOTION PRIMITIVES (Modules 23778, 31582, 53014, 21569, 35165, 79002)
   ========================================================================== */

function SectionDivider({
    src,
    height = 'clamp(28px, 8cqw, 52px)',
    width = '100%',
    flip = false,
    opacity = 1,
    className,
    style,
}: {
    src: string;
    height?: string;
    width?: string;
    flip?: boolean;
    opacity?: number;
    className?: string;
    style?: React.CSSProperties;
}) {
    const fallbackHeight = useMemo(() => {
        const m = /^clamp\(\s*([^,]+),\s*([0-9.]+)cqw\s*,\s*([^)]+)\)$/.exec(height.trim());
        if (!m) return undefined;
        const min = parseFloat(m[1]);
        const cqw = parseFloat(m[2]);
        const max = parseFloat(m[3]);
        if (Number.isNaN(min) || Number.isNaN(cqw) || Number.isNaN(max)) return undefined;
        const px = Math.min(max, Math.max(min, (cqw * 390) / 100));
        return `${Math.round(px * 100) / 100}px`;
    }, [height]);

    return (
        <div
            aria-hidden="true"
            className={[DECOR_CLASSES.divider, className].filter(Boolean).join(' ')}
            style={{
                width,
                height: 'var(--sd-height)',
                backgroundImage: `url(${src})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: '100% 100%',
                transform: flip ? 'scaleY(-1)' : undefined,
                opacity,
                pointerEvents: 'none',
                userSelect: 'none',
                '--sd-height': height,
                '--sd-height-fb': fallbackHeight ?? height,
                ...style,
            } as React.CSSProperties}
        />
    );
}

function OrnateFrame({
    borderImage,
    slice = 80,
    thickness = 'clamp(16px, 5cqw, 36px)',
    outset = '0px',
    repeat = 'stretch',
    padding,
    className,
    style,
    children,
}: {
    borderImage: string;
    slice?: number | string;
    thickness?: string;
    outset?: string;
    repeat?: string;
    padding?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}) {
    const fallbackThickness = useMemo(() => {
        const m = /^clamp\(\s*([^,]+),\s*([0-9.]+)cqw\s*,\s*([^)]+)\)$/.exec(thickness.trim());
        if (!m) return undefined;
        const min = parseFloat(m[1]);
        const cqw = parseFloat(m[2]);
        const max = parseFloat(m[3]);
        if (Number.isNaN(min) || Number.isNaN(cqw) || Number.isNaN(max)) return undefined;
        const px = Math.min(max, Math.max(min, (cqw * 390) / 100));
        return `${Math.round(px * 100) / 100}px`;
    }, [thickness]);

    return (
        <div
            className={[DECOR_CLASSES.frame, className].filter(Boolean).join(' ')}
            style={{
                position: 'relative',
                boxSizing: 'border-box',
                borderStyle: 'solid',
                borderColor: 'transparent',
                borderWidth: 'var(--of-thickness)',
                borderImageSource: `url(${borderImage})`,
                borderImageSlice: `${slice} fill`,
                borderImageWidth: 'var(--of-thickness)',
                borderImageOutset: outset,
                borderImageRepeat: repeat,
                padding: padding ?? 'var(--wed-space-md)',
                '--of-thickness': thickness,
                '--of-thickness-fb': fallbackThickness ?? thickness,
                ...style,
            } as React.CSSProperties}
        >
            {children}
        </div>
    );
}

function PaperTextureOverlay({
    src,
    tilePx = 320,
    opacity = 0.25,
    blend = 'multiply',
    zIndex = 0,
}: {
    src: string;
    tilePx?: number;
    opacity?: number;
    blend?: React.CSSProperties['mixBlendMode'];
    zIndex?: number;
}) {
    return (
        <div
            aria-hidden="true"
            style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${src})`,
                backgroundRepeat: 'repeat',
                backgroundSize: `${tilePx}px ${tilePx}px`,
                opacity,
                mixBlendMode: blend,
                pointerEvents: 'none',
                zIndex,
            }}
        />
    );
}

function CornerSprig({
    src,
    corner,
    widthPct = 28,
    maxPx = 220,
    offsetPx = 0,
    zIndex = 1,
    rotateDeg = 0,
    className,
    style,
}: {
    src: string;
    corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    widthPct?: number;
    maxPx?: number;
    offsetPx?: number;
    zIndex?: number;
    rotateDeg?: number;
    className?: string;
    style?: React.CSSProperties;
}) {
    const pos: React.CSSProperties = {
        position: 'absolute',
        width: `min(${widthPct}%, ${maxPx}px)`,
        height: 'auto',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex,
    };
    const transforms: string[] = [];
    if (corner.startsWith('top')) pos.top = offsetPx;
    else pos.bottom = offsetPx;
    if (corner.endsWith('left')) pos.left = offsetPx;
    else pos.right = offsetPx;

    if (corner === 'top-right') transforms.push('scaleX(-1)');
    else if (corner === 'bottom-left') transforms.push('scaleY(-1)');
    else if (corner === 'bottom-right') transforms.push('scale(-1, -1)');
    if (rotateDeg) transforms.push(`rotate(${rotateDeg}deg)`);
    if (transforms.length) pos.transform = transforms.join(' ');

    return (
        <img
            src={src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className={className}
            style={{ ...pos, ...style }}
        />
    );
}

function DecorEntrance({
    from = 'bottom',
    distance = 28,
    scaleFrom = 0.92,
    rotateFrom = 0,
    delay = 0,
    duration = 1100,
    threshold = 0.15,
    className,
    style,
    children,
}: {
    from?: 'left' | 'right' | 'top' | 'bottom' | 'scale';
    distance?: number;
    scaleFrom?: number;
    rotateFrom?: number;
    delay?: number;
    duration?: number;
    threshold?: number;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [entered, setEntered] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (typeof IntersectionObserver === 'undefined') {
            setEntered(true);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setEntered(true);
                        io.disconnect();
                        break;
                    }
                }
            },
            { threshold, rootMargin: '80px 0px 80px 0px' }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [threshold]);

    let tx = 0;
    let ty = 0;
    if (!entered) {
        if (from === 'left') tx = -distance;
        else if (from === 'right') tx = distance;
        else if (from === 'top') ty = -distance;
        else if (from === 'bottom') ty = distance;
    }

    const scale = entered ? 1 : scaleFrom;
    const rot = entered ? 0 : rotateFrom;
    const classes = [
        MOTION_CLASSES.decorEntrance,
        rotateFrom !== 0 ? MOTION_CLASSES.decorEntranceRotate : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            ref={ref}
            aria-hidden="true"
            className={classes}
            style={{
                opacity: entered ? 1 : 0,
                transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`,
                transitionProperty: 'opacity, transform',
                transitionDuration: `${duration}ms`,
                transitionTimingFunction: 'var(--wed-ease-out, cubic-bezier(0.22, 1, 0.36, 1))',
                transitionDelay: `${delay}ms`,
                willChange: entered ? 'auto' : 'opacity, transform',
                '--wed-enter-rot': `${rot}deg`,
                ...style,
            } as React.CSSProperties}
        >
            {children}
        </div>
    );
}

function AmbientPetalCanvas({
    count = 16,
    colors = ['#F08C1A', '#F2B33D', '#D14D7E', '#F7CDD3'],
    shape = 'petal',
    drift = 'down',
    speed = 1,
    wind = 0.25,
    sizeRange = [6, 14],
    opacityRange = [0.45, 0.9],
    zIndex = 2,
    paused = false,
    className,
}: {
    count?: number;
    colors?: string[];
    shape?: 'petal' | 'sparkle' | 'star';
    drift?: 'down' | 'up' | 'float';
    speed?: number;
    wind?: number;
    sizeRange?: [number, number];
    opacityRange?: [number, number];
    zIndex?: number;
    paused?: boolean;
    className?: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const colorsKey = colors.join('|');
    const [minSize, maxSize] = sizeRange;
    const [minOp, maxOp] = opacityRange;

    useEffect(() => {
        if (paused) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let width = 0;
        let height = 0;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            width = Math.max(1, rect.width);
            height = Math.max(1, rect.height);
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();

        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
        ro?.observe(canvas);

        const palette = colorsKey ? colorsKey.split('|') : ['#f4b183'];
        const rand = (a: number, b: number) => a + Math.random() * (b - a);

        const spawn = (randomY: boolean) => {
            const size = rand(minSize, maxSize);
            const vyBase =
                drift === 'up'
                    ? -rand(0.25, 0.7) * speed
                    : drift === 'float'
                      ? rand(-0.2, 0.2) * speed
                      : rand(0.35, 0.95) * speed;
            return {
                x: rand(0, width || 360),
                y: randomY ? rand(0, height || 640) : drift === 'up' ? (height || 640) + size : -size,
                vx: rand(-0.25, 0.25) + wind * 0.4,
                vy: vyBase,
                size,
                rot: rand(0, Math.PI * 2),
                vrot: rand(-0.018, 0.018),
                swayAmp: rand(0.3, 1.1),
                swayFreq: rand(0.008, 0.022),
                phase: rand(0, Math.PI * 2),
                color: palette[Math.floor(Math.random() * palette.length)] || '#f4b183',
                opacity: rand(minOp, maxOp),
            };
        };

        const particles = Array.from({ length: count }, () => spawn(true));
        let inView = true;
        const io =
            typeof IntersectionObserver !== 'undefined'
                ? new IntersectionObserver(([entry]) => {
                      inView = entry?.isIntersecting ?? true;
                  })
                : null;
        io?.observe(canvas);

        let raf = 0;
        let tick = 0;
        const draw = () => {
            raf = requestAnimationFrame(draw);
            if (!inView || document.hidden) return;
            tick += 1;
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.phase += p.swayFreq;
                p.x += p.vx + Math.sin(p.phase) * p.swayAmp;
                p.y += p.vy;
                p.rot += p.vrot;

                const margin = p.size * 2;
                if (drift === 'down' && p.y > height + margin) {
                    particles[i] = spawn(false);
                    continue;
                }
                if (drift === 'up' && p.y < -margin) {
                    particles[i] = spawn(false);
                    continue;
                }
                if (drift === 'float' && (p.y < -margin || p.y > height + margin)) {
                    p.vy = -p.vy;
                }
                if (p.x > width + margin) p.x = -margin;
                else if (p.x < -margin) p.x = width + margin;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.globalAlpha =
                    shape === 'sparkle'
                        ? p.opacity * (0.55 + 0.45 * Math.sin(tick * 0.05 + p.phase))
                        : p.opacity;
                ctx.fillStyle = p.color;

                if (shape === 'petal') {
                    const s = p.size;
                    ctx.beginPath();
                    ctx.moveTo(0, -s * 0.6);
                    ctx.bezierCurveTo(s * 0.65, -s * 0.4, s * 0.65, s * 0.5, 0, s * 0.7);
                    ctx.bezierCurveTo(-s * 0.65, s * 0.5, -s * 0.65, -s * 0.4, 0, -s * 0.6);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    const r = p.size * 0.5;
                    ctx.beginPath();
                    ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
        };

        raf = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(raf);
            ro?.disconnect();
            io?.disconnect();
        };
    }, [count, colorsKey, shape, drift, speed, wind, minSize, maxSize, minOp, maxOp, paused]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={className}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex,
            }}
        />
    );
}

/* ==========================================================================
   PRELOADER OVERLAY (Module 21569)
   ========================================================================== */

function PreloaderOverlay({
    monogram,
    WatchUrls,
    minDisplayMs = 550,
    maxWaitMs = 2600,
    className,
}: {
    monogram: string;
    WatchUrls: string[];
    minDisplayMs?: number;
    maxWaitMs?: number;
    className?: string;
}) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [phase, setPhase] = useState<'visible' | 'leaving' | 'gone'>('visible');
    const [progress, setProgress] = useState(0);
    const [fixed, setFixed] = useState(false);
    const urlsKey = WatchUrls.join('|');

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        const sc = findScrollContainer(el);
        setFixed(!sc);
    }, []);

    useEffect(() => {
        let cancelled = false;
        const start = performance.now();
        const urls = urlsKey ? urlsKey.split('|').filter(Boolean) : [];
        let loaded = 0;
        const total = Math.max(1, urls.length);

        const finish = () => {
            if (cancelled) return;
            const elapsed = performance.now() - start;
            const wait = Math.max(0, minDisplayMs - elapsed);
            window.setTimeout(() => {
                if (cancelled) return;
                setPhase('leaving');
                window.setTimeout(() => {
                    if (!cancelled) setPhase('gone');
                }, 900);
            }, wait);
        };

        const timeout = window.setTimeout(finish, maxWaitMs);

        if (urls.length === 0) {
            setProgress(1);
            finish();
        } else {
            urls.forEach((src) => {
                const img = new Image();
                const done = () => {
                    if (cancelled) return;
                    loaded += 1;
                    setProgress(loaded / total);
                    if (loaded >= total) finish();
                };
                img.onload = () => {
                    if (typeof img.decode === 'function') {
                        img.decode().then(done, done);
                    } else {
                        done();
                    }
                };
                img.onerror = done;
                img.src = src;
            });
        }

        return () => {
            cancelled = true;
            window.clearTimeout(timeout);
        };
    }, [urlsKey, minDisplayMs, maxWaitMs]);

    if (phase === 'gone') return null;

    const classes = [
        MOTION_CLASSES.preloader,
        fixed ? MOTION_CLASSES.preloaderFixed : '',
        phase === 'leaving' ? MOTION_CLASSES.preloaderLeaving : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div ref={rootRef} className={classes} role="status" aria-live="polite" aria-label="Loading invitation">
            <div className={MOTION_CLASSES.preloaderMonogram}>{monogram}</div>
            <div className={MOTION_CLASSES.preloaderBar}>
                <div
                    className={MOTION_CLASSES.preloaderFill}
                    style={{ width: `${Math.round(Math.max(0.15, progress) * 100)}%` }}
                />
            </div>
        </div>
    );
}

/* ==========================================================================
   INTERACTIVE PARDA CURTAIN-PULL OPENING OVERLAY (Module 92427 `k` + 74627)
   ========================================================================== */

const PULL_THRESHOLD_PX = 72;
const PULL_MAX_PX = 140;

function PardaOpening({
    greeting,
    onOpened,
}: {
    greeting?: { toLabel?: string } | null;
    onOpened?: () => void;
}) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const tasselRef = useRef<HTMLButtonElement | null>(null);
    const dragRef = useRef({
        id: -1,
        startY: 0,
        dy: 0,
        moved: false,
    });
    const bounceTimerRef = useRef<number | null>(null);
    const openedCalledRef = useRef(false);

    const [phase, setPhase] = useState<'sealed' | 'opening' | 'leaving' | 'hidden'>('sealed');
    const [fixed, setFixed] = useState(false);
    const [pullState, setPullState] = useState<'idle' | 'drag' | 'commit' | 'bounce'>('idle');
    const [escapeExit, setEscapeExit] = useState(false);
    const [showPetals, setShowPetals] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-parda-armed', '');
        const el = rootRef.current;
        if (!el) return;
        const sc = findScrollContainer(el);
        setFixed(!sc);
    }, []);

    useEffect(() => {
        if (phase === 'hidden') {
            document.documentElement.removeAttribute('data-parda-armed');
            return;
        }
        const el = rootRef.current;
        if (!el) return;
        if (phase === 'leaving') return;

        const sc = findScrollContainer(el);
        if (sc) {
            const prev = sc.style.overflowY;
            sc.style.overflowY = 'hidden';
            return () => {
                sc.style.overflowY = prev;
            };
        }
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [phase]);

    useEffect(() => {
        if (phase === 'sealed') {
            const id = requestAnimationFrame(() => {
                tasselRef.current?.focus({ preventScroll: true });
            });
            return () => cancelAnimationFrame(id);
        }
        if (phase === 'opening' && !openedCalledRef.current) {
            openedCalledRef.current = true;
            onOpened?.();
        }
    }, [phase, onOpened]);

    useEffect(() => {
        if (phase !== 'opening' || escapeExit) return;
        const t = window.setTimeout(() => setShowPetals(true), 400);
        return () => window.clearTimeout(t);
    }, [phase, escapeExit]);

    useEffect(() => {
        return () => {
            if (bounceTimerRef.current !== null) {
                window.clearTimeout(bounceTimerRef.current);
            }
        };
    }, []);

    const setPullCss = (px: number) => {
        rootRef.current?.style.setProperty('--parda-pull', `${Math.round(px)}px`);
    };

    const triggerOpen = (viaEscape = false, pullPx = PULL_MAX_PX) => {
        if (phase !== 'sealed') return;
        if (bounceTimerRef.current !== null) {
            window.clearTimeout(bounceTimerRef.current);
            bounceTimerRef.current = null;
        }
        window.dispatchEvent(new CustomEvent('wed:music-play'));

        if (viaEscape) {
            setEscapeExit(true);
            setPullCss(0);
            setPullState('idle');
            setPhase('leaving');
            window.setTimeout(() => setPhase('hidden'), 380);
            return;
        }

        setPullCss(pullPx);
        setPullState('idle');
        setPhase('opening');
        window.setTimeout(() => setPhase('leaving'), 1400);
        window.setTimeout(() => setPhase('hidden'), 2100);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
        if (phase !== 'sealed') return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        if (bounceTimerRef.current !== null) {
            window.clearTimeout(bounceTimerRef.current);
            bounceTimerRef.current = null;
        }
        dragRef.current = {
            id: e.pointerId,
            startY: e.clientY,
            dy: 0,
            moved: false,
        };
        setPullState('drag');
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
            /* ignore */
        }
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
        const d = dragRef.current;
        if (d.id !== e.pointerId || phase !== 'sealed') return;
        const rawDy = Math.max(0, e.clientY - d.startY);
        const clampedDy =
            rawDy <= PULL_THRESHOLD_PX
                ? rawDy
                : Math.min(PULL_MAX_PX, PULL_THRESHOLD_PX + 0.42 * (rawDy - PULL_THRESHOLD_PX));
        d.dy = clampedDy;
        if (clampedDy > 6) d.moved = true;
        setPullCss(clampedDy);
        const nextState = clampedDy >= PULL_THRESHOLD_PX ? 'commit' : 'drag';
        if (nextState !== pullState) setPullState(nextState);
    };

    const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLButtonElement>, cancelled: boolean) => {
        const d = dragRef.current;
        if (d.id !== e.pointerId) return;
        dragRef.current = { id: -1, startY: 0, dy: 0, moved: false };
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            /* ignore */
        }
        if (phase !== 'sealed') return;

        if (!cancelled && (!d.moved || d.dy >= PULL_THRESHOLD_PX)) {
            triggerOpen(false, d.moved ? Math.max(d.dy, 93.6) : 112);
            return;
        }

        setPullCss(0);
        setPullState('bounce');
        bounceTimerRef.current = window.setTimeout(() => {
            setPullState('idle');
            bounceTimerRef.current = null;
        }, 520);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (phase !== 'sealed') return;
        if (e.key === 'Escape') {
            e.preventDefault();
            triggerOpen(true);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            triggerOpen(false, 112);
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (phase === 'sealed' && e.detail === 0) {
            triggerOpen(false, 112);
        }
    };

    if (phase === 'hidden') return null;

    const toLineText = greeting?.toLabel || 'To our dearest guests';
    const rootClass = [PARDA_CLASSES.root, fixed ? PARDA_CLASSES.rootFixed : ''].filter(Boolean).join(' ');

    return (
        <div
            ref={rootRef}
            className={rootClass}
            data-parda=""
            data-phase={phase}
            data-pull={pullState !== 'idle' ? pullState : undefined}
            data-exit={escapeExit ? 'escape' : undefined}
            role="dialog"
            aria-modal="true"
            aria-label="Open wedding invitation"
            onKeyDown={handleKeyDown}
            style={{
                backgroundColor: '#D8496B',
                '--parda-ratio': String(ARCH_RATIO),
                '--parda-ap-x0': `${PARDA_APERTURE.left}%`,
                '--parda-ap-x1': `${PARDA_APERTURE.right}%`,
                '--parda-ap-y0': `${PARDA_APERTURE.top}%`,
                '--parda-ap-y1': `${PARDA_APERTURE.bottom}%`,
            } as React.CSSProperties}
        >
            <div className={PARDA_CLASSES.stage} style={{ aspectRatio: `${ARCH_RATIO}` }}>
                <div className={PARDA_CLASSES.aperture} aria-hidden="true">
                    <div className={`${PARDA_CLASSES.half} ${PARDA_CLASSES.halfLeft}`}>
                        <div
                            className={PARDA_CLASSES.sheet}
                            style={{ backgroundImage: `url(${ART_BASE}/parda-curtain.webp)` }}
                        />
                    </div>
                    <div className={`${PARDA_CLASSES.half} ${PARDA_CLASSES.halfRight}`}>
                        <div
                            className={PARDA_CLASSES.sheet}
                            style={{ backgroundImage: `url(${ART_BASE}/parda-curtain.webp)` }}
                        />
                    </div>
                </div>

                <img
                    className={PARDA_CLASSES.arch}
                    src={`${ART_BASE}/parda-arch.webp`}
                    alt=""
                    aria-hidden="true"
                    decoding="async"
                />

                {showPetals && (
                    <AmbientPetalCanvas
                        count={22}
                        colors={['#F08C1A', '#F2B33D', '#D14D7E', '#F7CDD3']}
                        speed={1.25}
                        wind={0.22}
                        sizeRange={[7, 15]}
                        opacityRange={[0.55, 0.95]}
                        zIndex={3}
                        className={PARDA_CLASSES.petals}
                    />
                )}

                <div className={PARDA_CLASSES.rope}>
                    <div className={PARDA_CLASSES.ropeLine}>
                        <div
                            className={PARDA_CLASSES.cord}
                            style={{ backgroundImage: `url(${ART_BASE}/parda-rope-cord.webp)` }}
                            aria-hidden="true"
                        />
                        <button
                            ref={tasselRef}
                            type="button"
                            className={PARDA_CLASSES.tassel}
                            aria-label={`${toLineText}. Pull or tap the tassel to open the invitation`}
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={(e) => handlePointerUpOrCancel(e, false)}
                            onPointerCancel={(e) => handlePointerUpOrCancel(e, true)}
                            onClick={handleClick}
                        >
                            <img
                                className={PARDA_CLASSES.tasselArt}
                                src={`${ART_BASE}/parda-rope-tassel.webp`}
                                alt=""
                                aria-hidden="true"
                                draggable={false}
                                decoding="async"
                            />
                        </button>
                    </div>
                </div>

                <div className={PARDA_CLASSES.tap} aria-hidden="true">
                    {toLineText && <p className={PARDA_CLASSES.toLine}>{toLineText}</p>}
                    <p className={PARDA_CLASSES.hint}>
                        <span className={PARDA_CLASSES.hintLine}>
                            रस्सी खींचिए · pull the rope to part the curtain
                        </span>
                        <span className={PARDA_CLASSES.hintLine} data-release="">
                            छोड़िए · let go to open
                        </span>
                    </p>
                </div>
            </div>

            <div className={PARDA_CLASSES.bloom} aria-hidden="true" />
        </div>
    );
}

/* ==========================================================================
   GOLD-FOIL SCRATCH CARD FOR SHUBH MUHURAT DATE REVEAL (Module 79002)
   ========================================================================== */

function ScratchToReveal({
    foilImage,
    foilColor = '#C9973B',
    brushPx = 40,
    threshold = 0.45,
    hint = 'Scratch with your finger to reveal the date',
    onScratchStart,
    onReveal,
    className,
    style,
    children,
}: {
    foilImage: string;
    foilColor?: string;
    brushPx?: number;
    threshold?: number;
    hint?: string;
    onScratchStart?: () => void;
    onReveal?: () => void;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [revealed, setRevealed] = useState(false);
    const isDrawingRef = useRef(false);
    const startedRef = useRef(false);
    const lastPosRef = useRef<{ x: number; y: number } | null>(null);
    const strokeCountRef = useRef(0);

    const completeReveal = () => {
        setRevealed((prev) => {
            if (!prev) onReveal?.();
            return true;
        });
    };

    const notifyStart = () => {
        if (!startedRef.current) {
            startedRef.current = true;
            onScratchStart?.();
        }
    };

    useEffect(() => {
        if (revealed) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let img: HTMLImageElement | null = null;

        const paintFoil = () => {
            const rect = canvas.getBoundingClientRect();
            const w = Math.max(1, rect.width);
            const h = Math.max(1, rect.height);
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = foilColor;
            ctx.fillRect(0, 0, w, h);

            if (img && img.complete && img.naturalWidth > 0) {
                const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
                const dw = img.naturalWidth * scale;
                const dh = img.naturalHeight * scale;
                ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
            }
        };

        paintFoil();
        img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = paintFoil;
        img.src = foilImage;

        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(paintFoil) : null;
        ro?.observe(canvas);
        return () => ro?.disconnect();
    }, [foilImage, foilColor, revealed]);

    const scratchPoint = (x: number, y: number) => {
        const canvas = canvasRef.current;
        if (!canvas || revealed) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = brushPx;

        const last = lastPosRef.current;
        ctx.beginPath();
        if (last) {
            ctx.moveTo(last.x, last.y);
            ctx.lineTo(x, y);
            ctx.stroke();
        } else {
            ctx.arc(x, y, brushPx * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
        lastPosRef.current = { x, y };
        strokeCountRef.current += 1;

        if (strokeCountRef.current % 10 === 0) {
            try {
                const { width, height } = canvas;
                const data = ctx.getImageData(0, 0, width, height).data;
                let transparent = 0;
                let total = 0;
                for (let i = 3; i < data.length; i += 32) {
                    total += 1;
                    if (data[i] < 64) transparent += 1;
                }
                if (total > 0 && transparent / total >= threshold) {
                    completeReveal();
                }
            } catch {
                if (strokeCountRef.current > 45) completeReveal();
            }
        }
    };

    const getLocalCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (revealed) return;
        isDrawingRef.current = true;
        lastPosRef.current = null;
        notifyStart();
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
            /* ignore */
        }
        const pt = getLocalCoords(e);
        scratchPoint(pt.x, pt.y);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawingRef.current || revealed) return;
        const pt = getLocalCoords(e);
        scratchPoint(pt.x, pt.y);
    };

    const handlePointerEnd = () => {
        isDrawingRef.current = false;
        lastPosRef.current = null;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            notifyStart();
            completeReveal();
        }
    };

    return (
        <div
            className={[MOTION_CLASSES.scratchRoot, className].filter(Boolean).join(' ')}
            style={style}
        >
            {children}
            <canvas
                ref={canvasRef}
                role="button"
                tabIndex={revealed ? -1 : 0}
                aria-label={hint}
                aria-hidden={revealed}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
                onKeyDown={handleKeyDown}
                className={[
                    MOTION_CLASSES.scratchCanvas,
                    revealed ? MOTION_CLASSES.scratchCanvasGone : '',
                ]
                    .filter(Boolean)
                    .join(' ')}
            />
        </div>
    );
}

/* ==========================================================================
   LIVE COUNTDOWN TIMER (Module 56425)
   ========================================================================== */

function computeCountdownParts(target: Date) {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

function CountdownTimer({ targetDate, className = '' }: { targetDate?: string; className?: string }) {
    const target = useMemo(() => {
        if (!targetDate) return null;
        const str = targetDate.includes('T') ? targetDate : `${targetDate}T11:00:00`;
        const d = new Date(str);
        return Number.isNaN(d.getTime()) ? null : d;
    }, [targetDate]);

    const [parts, setParts] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        if (!target) return;
        const update = () => setParts(computeCountdownParts(target));
        update();
        const id = window.setInterval(update, 1000);
        return () => window.clearInterval(id);
    }, [target]);

    if (!target) return null;
    const pad = (n: number) => String(n).padStart(2, '0');

    return (
        <div className={`we-countdown ${className}`.trim()} aria-label="Countdown to wedding">
            <span>
                <strong>{parts ? pad(parts.days) : '—'}</strong>
                <small>Days</small>
            </span>
            <span>
                <strong>{parts ? pad(parts.hours) : '—'}</strong>
                <small>Hours</small>
            </span>
            <span>
                <strong>{parts ? pad(parts.minutes) : '—'}</strong>
                <small>Mins</small>
            </span>
            <span>
                <strong>{parts ? pad(parts.seconds) : '—'}</strong>
                <small>Secs</small>
            </span>
        </div>
    );
}

/* ==========================================================================
   KITNA JAANTE HO? — TRIVIA QUIZ SECTION (Module 46231)
   ========================================================================== */

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

function TriviaSection({
    partnerOne,
    partnerTwo,
    eyebrow = 'Kitna Jaante Ho?',
    chrome = 'none',
    className = '',
}: {
    partnerOne: string;
    partnerTwo: string;
    eyebrow?: string;
    chrome?: 'default' | 'none';
    className?: string;
}) {
    const questions = useMemo(
        () => DEFAULT_TRIVIA_QUESTIONS(partnerOne, partnerTwo),
        [partnerOne, partnerTwo]
    );
    const total = questions.length;
    const sides = { one: 'Ladkiwale', two: 'Ladkewale' };

    const cardRef = useRef<HTMLDivElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const timerRef = useRef<number | null>(null);
    const headingId = useId();

    const [portalHost, setPortalHost] = useState<{ host: HTMLElement; fixed: boolean } | null>(null);
    const [activeSide, setActiveSide] = useState<'one' | 'two' | null>(null);
    const [qIndex, setQIndex] = useState(0);
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
    const [answersLog, setAnswersLog] = useState<boolean[]>([]);
    const [finished, setFinished] = useState(false);
    const [copied, setCopied] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [nameSaved, setNameSaved] = useState(false);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const sc = findScrollContainer(el);
        const host = el.closest('[class*="site"]') || sc || document.body;
        setPortalHost({
            host: host as HTMLElement,
            fixed: host === document.body,
        });
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current !== null) window.clearTimeout(timerRef.current);
        };
    }, []);

    useEffect(() => {
        if (activeSide === null) return;
        const el = cardRef.current;
        const sc = el ? findScrollContainer(el) : null;
        if (sc) {
            const prev = sc.style.overflowY;
            sc.style.overflowY = 'hidden';
            return () => {
                sc.style.overflowY = prev;
            };
        }
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [activeSide]);

    const currentQ = activeSide !== null && !finished ? questions[qIndex] : null;
    const score = answersLog.filter(Boolean).length;

    const advanceQuestion = () => {
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        const nextIdx = qIndex + 1;
        if (nextIdx >= total) {
            setSelectedOpt(null);
            setFinished(true);
        } else {
            setQIndex(nextIdx);
            setSelectedOpt(null);
        }
    };

    const startQuiz = (sideIdx: 0 | 1) => {
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setActiveSide(sideIdx === 0 ? 'one' : 'two');
        setQIndex(0);
        setSelectedOpt(null);
        setAnswersLog([]);
        setFinished(false);
        setCopied(false);
        setPlayerName('');
        setNameSaved(false);
        requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));
    };

    const closeQuiz = () => {
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setActiveSide(null);
    };

    const selectOption = (optIdx: number) => {
        if (selectedOpt !== null || !currentQ) return;
        const isCorrect = optIdx === currentQ.answer;
        setSelectedOpt(optIdx);
        setAnswersLog((prev) => [...prev, isCorrect]);
        timerRef.current = window.setTimeout(advanceQuestion, 750);
    };

    const verdictText = useMemo(() => {
        const ratio = total > 0 ? score / total : 0;
        if (ratio >= 1) return 'Have you been reading their diary?!';
        if (ratio >= 0.7) return 'The family detective 🕵️';
        if (ratio >= 0.4) return 'Distant-relative level — brush up!';
        return 'Only here for the food? 😄';
    }, [score, total]);

    const handleShare = () => {
        const sideLabel = activeSide === 'two' ? sides.two : sides.one;
        const text = `I scored ${score}/${total} in ${partnerOne} & ${partnerTwo}'s "Kitna Jaante Ho" — playing for ${sideLabel}! How well do you know them? ${typeof window !== 'undefined' ? window.location.href : ''}`;
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({ text }).catch(() => {});
            return;
        }
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard
                .writeText(text)
                .then(() => {
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                })
                .catch(() => {});
        }
    };

    const modalSheet =
        activeSide !== null && portalHost
            ? createPortal(
                  <div
                      className={TRIVIA_CLASSES.sheet}
                      data-fixed={portalHost.fixed ? 'true' : undefined}
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby={headingId}
                      onClick={(e) => {
                          if (e.target === e.currentTarget) closeQuiz();
                      }}
                  >
                      <div
                          className={TRIVIA_CLASSES.panel}
                          ref={panelRef}
                          tabIndex={-1}
                          data-side={activeSide}
                      >
                          <div className={TRIVIA_CLASSES.topBar}>
                              <div className={TRIVIA_CLASSES.topLines}>
                                  <span className={TRIVIA_CLASSES.sheetName}>
                                      {activeSide === 'two' ? sides.two : sides.one}
                                  </span>
                                  {!finished && (
                                      <span className={TRIVIA_CLASSES.progress}>
                                          Question {qIndex + 1} / {total}
                                      </span>
                                  )}
                              </div>
                              <button
                                  type="button"
                                  className={TRIVIA_CLASSES.close}
                                  onClick={closeQuiz}
                                  aria-label="Close the game"
                              >
                                  <svg viewBox="0 0 16 16" aria-hidden="true">
                                      <path
                                          d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                      />
                                  </svg>
                              </button>
                          </div>

                          <div className={TRIVIA_CLASSES.dots} aria-hidden="true">
                              {questions.map((_, idx) => {
                                  const ans = answersLog[idx];
                                  const cls = [
                                      TRIVIA_CLASSES.dot,
                                      ans === true ? TRIVIA_CLASSES.dotRight : '',
                                      ans === false ? TRIVIA_CLASSES.dotWrong : '',
                                  ]
                                      .filter(Boolean)
                                      .join(' ');
                                  return (
                                      <span
                                          key={idx}
                                          className={cls}
                                          data-current={!finished && idx === qIndex ? 'true' : undefined}
                                      />
                                  );
                              })}
                          </div>

                          <div
                              className={`${TRIVIA_CLASSES.body} ${finished ? TRIVIA_CLASSES.bodyResult : ''}`}
                          >
                              {finished ? (
                                  <div className={TRIVIA_CLASSES.result}>
                                      <p className={TRIVIA_CLASSES.resultTitle}>Your score</p>
                                      <p className={TRIVIA_CLASSES.score}>
                                          {score}
                                          <span className={TRIVIA_CLASSES.scoreTotal}>/{total}</span>
                                      </p>
                                      <p className={TRIVIA_CLASSES.verdict}>{verdictText}</p>
                                      <p className={TRIVIA_CLASSES.tally}>
                                          +{score} for {activeSide === 'two' ? sides.two : sides.one}
                                      </p>

                                      {nameSaved ? (
                                          <p className={TRIVIA_CLASSES.nameDone}>Name added ✨</p>
                                      ) : (
                                          <form
                                              className={TRIVIA_CLASSES.nameRow}
                                              onSubmit={(e) => {
                                                  e.preventDefault();
                                                  if (playerName.trim()) setNameSaved(true);
                                              }}
                                          >
                                              <label className={TRIVIA_CLASSES.nameLabel} htmlFor="kj-sp-name">
                                                  Name for the leaderboard (optional)
                                              </label>
                                              <div className={TRIVIA_CLASSES.nameField}>
                                                  <input
                                                      id="kj-sp-name"
                                                      type="text"
                                                      className={TRIVIA_CLASSES.nameInput}
                                                      value={playerName}
                                                      onChange={(e) => setPlayerName(e.target.value)}
                                                      placeholder="Your name"
                                                      maxLength={40}
                                                  />
                                                  <button
                                                      type="submit"
                                                      className={TRIVIA_CLASSES.nameSave}
                                                      disabled={!playerName.trim()}
                                                  >
                                                      Add
                                                  </button>
                                              </div>
                                          </form>
                                      )}

                                      <div className={TRIVIA_CLASSES.actions}>
                                          <button
                                              type="button"
                                              className={TRIVIA_CLASSES.primary}
                                              onClick={handleShare}
                                          >
                                              {copied ? 'Copied!' : 'Share on WhatsApp'}
                                          </button>
                                          <button
                                              type="button"
                                              className={TRIVIA_CLASSES.ghost}
                                              onClick={closeQuiz}
                                          >
                                              Back to the invitation
                                          </button>
                                      </div>
                                  </div>
                              ) : currentQ ? (
                                  <>
                                      <p className={TRIVIA_CLASSES.prompt}>{currentQ.prompt}</p>
                                      <div className={TRIVIA_CLASSES.options}>
                                          {currentQ.options.map((opt, idx) => {
                                              const hasSelected = selectedOpt !== null;
                                              const isRight = idx === currentQ.answer;
                                              const isWrong = hasSelected && selectedOpt === idx && !isRight;
                                              const cls = [
                                                  TRIVIA_CLASSES.option,
                                                  hasSelected && isRight ? TRIVIA_CLASSES.optionRight : '',
                                                  isWrong ? TRIVIA_CLASSES.optionWrong : '',
                                                  hasSelected && selectedOpt === idx
                                                      ? TRIVIA_CLASSES.optionPulse
                                                      : '',
                                              ]
                                                  .filter(Boolean)
                                                  .join(' ');
                                              return (
                                                  <button
                                                      key={idx}
                                                      type="button"
                                                      className={cls}
                                                      onClick={() => selectOption(idx)}
                                                      disabled={hasSelected}
                                                  >
                                                      <span className={TRIVIA_CLASSES.pip} aria-hidden="true">
                                                          {hasSelected && isRight ? (
                                                              <svg viewBox="0 0 16 16" aria-hidden="true">
                                                                  <path
                                                                      d="M3.2 8.4 6.6 11.8 12.8 4.6"
                                                                      fill="none"
                                                                      stroke="currentColor"
                                                                      strokeWidth="1.8"
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                  />
                                                              </svg>
                                                          ) : isWrong ? (
                                                              <svg viewBox="0 0 16 16" aria-hidden="true">
                                                                  <path
                                                                      d="M4.2 4.2 11.8 11.8M11.8 4.2 4.2 11.8"
                                                                      fill="none"
                                                                      stroke="currentColor"
                                                                      strokeWidth="1.7"
                                                                      strokeLinecap="round"
                                                                  />
                                                              </svg>
                                                          ) : (
                                                              OPTION_LETTERS[idx]
                                                          )}
                                                      </span>
                                                      <span className={TRIVIA_CLASSES.optionText}>{opt}</span>
                                                  </button>
                                              );
                                          })}
                                      </div>
                                      <p
                                          className={`${TRIVIA_CLASSES.verdictLine} ${
                                              selectedOpt === null
                                                  ? ''
                                                  : selectedOpt === currentQ.answer
                                                    ? TRIVIA_CLASSES.verdictRight
                                                    : TRIVIA_CLASSES.verdictWrong
                                          }`}
                                          role="status"
                                      >
                                          {selectedOpt === null
                                              ? ''
                                              : selectedOpt === currentQ.answer
                                                ? 'Correct!'
                                                : 'Not quite!'}
                                      </p>
                                  </>
                              ) : null}
                          </div>
                      </div>
                  </div>,
                  portalHost.host
              )
            : null;

    const isBare = chrome === 'none';

    return (
        <div
            ref={cardRef}
            className={`${TRIVIA_CLASSES.card} ${isBare ? TRIVIA_CLASSES.cardBare : ''} ${className}`.trim()}
        >
            <svg className={TRIVIA_CLASSES.toran} viewBox="0 0 240 20" aria-hidden="true">
                <line
                    x1="12"
                    y1="2"
                    x2="228"
                    y2="2"
                    stroke="currentColor"
                    strokeWidth="0.7"
                    opacity="0.45"
                />
                {[28, 64, 100, 140, 176, 212].map((cx) => (
                    <g key={cx} transform={`translate(${cx} 2)`}>
                        <path
                            d="M-14 0 Q0 12 14 0"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.8"
                            opacity="0.4"
                        />
                        <circle cx="0" cy="9" r="2.2" fill="currentColor" opacity="0.65" />
                        <path d="M0 11.5 L-2 16 L0 15 L2 16 Z" fill="currentColor" opacity="0.5" />
                    </g>
                ))}
                <g transform="translate(120 2)">
                    <circle cx="0" cy="7" r="3" fill="currentColor" opacity="0.8" />
                    <path d="M0 10.5 L-3 17 L0 15.5 L3 17 Z" fill="currentColor" opacity="0.65" />
                </g>
            </svg>

            <p className={TRIVIA_CLASSES.eyebrow}>{eyebrow}</p>
            <h2 className={TRIVIA_CLASSES.heading} id={headingId}>
                {sides.one} vs {sides.two}
            </h2>
            <p className={TRIVIA_CLASSES.subline}>{total} questions. Two sides. One winner.</p>

            <div className={TRIVIA_CLASSES.sides}>
                <button
                    type="button"
                    className={`${TRIVIA_CLASSES.side} ${TRIVIA_CLASSES.sideOne}`}
                    onClick={() => startQuiz(0)}
                >
                    <span className={TRIVIA_CLASSES.sidePip} aria-hidden="true" />
                    <span className={TRIVIA_CLASSES.sideName}>{sides.one}</span>
                    <span className={TRIVIA_CLASSES.sideFor}>Playing for {partnerOne}</span>
                </button>
                <span className={TRIVIA_CLASSES.vs} aria-hidden="true">
                    vs
                </span>
                <button
                    type="button"
                    className={`${TRIVIA_CLASSES.side} ${TRIVIA_CLASSES.sideTwo}`}
                    onClick={() => startQuiz(1)}
                >
                    <span className={TRIVIA_CLASSES.sidePip} aria-hidden="true" />
                    <span className={TRIVIA_CLASSES.sideName}>{sides.two}</span>
                    <span className={TRIVIA_CLASSES.sideFor}>Playing for {partnerTwo}</span>
                </button>
            </div>

            <p className={TRIVIA_CLASSES.teaser}>Be the first to play ✨</p>
            {modalSheet}
        </div>
    );
}

/* ==========================================================================
   WARM REGARDS SECTION (Module 14662)
   ========================================================================== */

function RegardsSection({
    note,
    people,
}: {
    note: string;
    people: Array<{ name: string; phone?: string }>;
}) {
    return (
        <div className={REGARDS_CLASSES.regards}>
            <span className={REGARDS_CLASSES.rule} aria-hidden="true" />
            <p className={REGARDS_CLASSES.eyebrow}>With warm regards</p>
            {note && <p className={REGARDS_CLASSES.note}>{note}</p>}
            {people.length > 0 && (
                <ul className={REGARDS_CLASSES.list}>
                    {people.map((p, idx) => {
                        const cleanDigits = (p.phone || '').replace(/[^\d+]/g, '');
                        return (
                            <li key={idx} className={REGARDS_CLASSES.person}>
                                <span className={REGARDS_CLASSES.name}>{p.name}</span>
                                {p.phone && cleanDigits.length >= 6 && (
                                    <a
                                        href={`tel:${cleanDigits}`}
                                        className={REGARDS_CLASSES.phone}
                                        aria-label={`Call ${p.name} at ${p.phone}`}
                                    >
                                        <svg
                                            viewBox="0 0 16 16"
                                            aria-hidden="true"
                                            className={REGARDS_CLASSES.phoneIcon}
                                        >
                                            <path
                                                d="M3.6 2.5h2.1l1 3-1.4 1.1a9.2 9.2 0 0 0 4.1 4.1l1.1-1.4 3 1v2.1a1.3 1.3 0 0 1-1.4 1.3A11.3 11.3 0 0 1 2.3 3.9 1.3 1.3 0 0 1 3.6 2.5Z"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.25"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span>{p.phone}</span>
                                    </a>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

/* ==========================================================================
   MUSIC TOGGLE BUTTON (Module 49963)
   ========================================================================== */

function MusicToggle({ src }: { src: string }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        let unlocked = false;

        const playAudio = () => {
            if (unlocked) return;
            audio
                .play()
                .then(() => {
                    unlocked = true;
                    setPlaying(true);
                    cleanupUnlock();
                })
                .catch(() => {});
        };

        const handleFirstGesture = (e: Event) => {
            const target = e.target;
            if (target instanceof Element && target.closest('.we-music-toggle')) return;
            playAudio();
        };

        const cleanupUnlock = () => {
            window.removeEventListener('pointerdown', handleFirstGesture);
            window.removeEventListener('keydown', handleFirstGesture);
            window.removeEventListener('touchstart', handleFirstGesture);
        };

        const handleMusicPlayEvent = () => {
            audio
                .play()
                .then(() => {
                    unlocked = true;
                    setPlaying(true);
                    cleanupUnlock();
                })
                .catch(() => {});
        };

        window.addEventListener('pointerdown', handleFirstGesture, { passive: true });
        window.addEventListener('touchstart', handleFirstGesture, { passive: true });
        window.addEventListener('keydown', handleFirstGesture);
        window.addEventListener('wed:music-play', handleMusicPlayEvent);

        return () => {
            cleanupUnlock();
            window.removeEventListener('wed:music-play', handleMusicPlayEvent);
        };
    }, [src]);

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (playing) {
            audio.pause();
            setPlaying(false);
        } else {
            audio
                .play()
                .then(() => setPlaying(true))
                .catch(() => setPlaying(false));
        }
    };

    return (
        <>
            <audio ref={audioRef} src={src} loop preload="none" />
            <button
                type="button"
                onClick={toggle}
                className={`we-music-toggle ${playing ? 'is-playing' : ''}`}
                aria-label={playing ? 'Pause background music' : 'Play background music'}
                title={playing ? 'Pause music' : 'Play music'}
            >
                {playing ? (
                    <span className="we-music-bars" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                    </span>
                ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </button>
        </>
    );
}

/* ==========================================================================
   MAIN SAAT PHERE REPLICA COMPONENT FOR MODERN ROMANCE (Module 92427)
   ========================================================================== */

export default function ModernRomance({ wedding, isPreview = false }: WebsiteTemplateProps) {
    const data = useWeddingTemplateData(wedding, isPreview);

    // Resolve Partner Names (defaulting to Saat Phere's Meera & Kabir when sample/default)
    const isDefaultSample =
        data.groomName === 'Rahul' && data.brideName === 'Anjali';
    const partnerOne = isDefaultSample ? 'Meera' : data.brideName || data.groomName || 'Meera';
    const partnerTwo = isDefaultSample ? 'Kabir' : data.groomName || data.brideName || 'Kabir';

    // Resolve Wedding Date (defaulting to 2027-05-14 when sample)
    const weddingDateIso =
        !data.primaryDateStr || data.primaryDateStr === '2027-02-05'
            ? '2027-05-14'
            : data.primaryDateStr;
    const dateParts = useMemo(() => parseDateParts(weddingDateIso), [weddingDateIso]);
    const formattedDateLong = useMemo(() => formatLongDate(weddingDateIso), [weddingDateIso]);
    const formattedDateShort = useMemo(() => formatShortDate(weddingDateIso), [weddingDateIso]);

    // Resolve Location & Venue
    const locationTitle =
        !data.venueLocation || data.venueLocation.includes('Rajputana') || data.venueLocation.includes('Oberoi')
            ? 'The Palace Gardens'
            : data.venueCity || data.venueLocation;
    const venueTitle =
        !data.venueLocation || data.venueLocation.includes('Rajputana') || data.venueLocation.includes('Oberoi')
            ? 'The Grand Ballroom'
            : data.venueLocation;
    const fullVenueLine = [venueTitle, locationTitle]
        .filter((v, idx, arr) => Boolean(v) && arr.indexOf(v) === idx)
        .join(', ');

    // Resolve Tagline & Invitation Message
    const heroMessage = 'Two families, one courtyard, and seven steps taken together.';
    const invitationMessage =
        !wedding.invitationMessage ||
        wedding.invitationMessage.includes('With the blessings of the divine')
            ? 'Together with our families, we invite you to join us as we take our seven steps together. Your presence, your laughter and your blessings are all we could wish for on this day.'
            : wedding.invitationMessage;

    // Resolve Families
    const partnerOneParents =
        !wedding.brideParents || wedding.brideParents === 'Mr and Mrs Patel'
            ? 'Mrs. Sunita & Mr. Rajesh Sharma'
            : wedding.brideParents;
    const partnerTwoParents =
        !wedding.groomParents || wedding.groomParents === 'Mr and Mrs Bajaj'
            ? 'Mrs. Kavita & Mr. Anil Verma'
            : wedding.groomParents;
    const familyBlessing = 'Seek your blessings and warm wishes as their children begin a new chapter together.';

    // Resolve Events
    const hasCustomEvents =
        Array.isArray(wedding.events) &&
        wedding.events.length > 0 &&
        wedding.events[0]?.name !== 'Haldi Ceremony' &&
        wedding.events[0]?.name !== 'Mehendi Ceremony';
    const eventsList = useMemo(() => {
        if (hasCustomEvents) {
            return wedding.events.map((ev, idx) => ({
                name: ev.name || `Celebration ${idx + 1}`,
                date: ev.date || weddingDateIso,
                time: ev.time || '18:00',
                venue: ev.venue || locationTitle,
                desc: ev.description || '',
                dressCodeColors:
                    DEFAULT_SAAT_PHERE_EVENTS[idx % DEFAULT_SAAT_PHERE_EVENTS.length].dressCodeColors,
            }));
        }
        return DEFAULT_SAAT_PHERE_EVENTS;
    }, [hasCustomEvents, wedding.events, weddingDateIso, locationTitle]);

    // Resolve Story
    const storyText =
        'We met through friends on an ordinary evening, and somewhere between long conversations and longer walks we stopped counting the days apart. With our families beside us, we are ready to begin — and we would love for you to be there when we do.';
    const hashtag = `#${partnerOne}And${partnerTwo}`.replace(/\s+/g, '');

    // Resolve Gallery
    const galleryPhotos = useMemo(() => {
        if (data.customGalleryImages.length > 0) {
            return data.customGalleryImages;
        }
        return DEFAULT_SAAT_PHERE_GALLERY;
    }, [data.customGalleryImages]);

    // Resolve Audio
    const audioSrc =
        data.audioUrl && data.audioUrl !== '/music/shubha-aagaman.m4a'
            ? data.audioUrl
            : DEFAULT_AUDIO_SRC;

    // Interactive State
    const heroCopyRef = useRef<HTMLDivElement | null>(null);
    const heroStackRef = useRef<HTMLDivElement | null>(null);
    const coverRef = useRef<HTMLElement | null>(null);
    const rsvpSectionRef = useRef<HTMLElement | null>(null);
    const floatBtnRef = useRef<HTMLButtonElement | null>(null);

    const [heroFit, setHeroFit] = useState<0 | 1 | 2 | 3>(0);
    const [scratchStarted, setScratchStarted] = useState(false);
    const [dateRevealed, setDateRevealed] = useState(false);
    const [showMuhuratPetals, setShowMuhuratPetals] = useState(false);
    const [zoomedGalleryIdx, setZoomedGalleryIdx] = useState<number | null>(null);
    const [copiedAddr, setCopiedAddr] = useState(false);
    const [floatVisible, setFloatVisible] = useState(false);
    const [floatSticky, setFloatSticky] = useState(false);

    // Auto-fit hero stack text inside arch (Module 92427 lines 302-322)
    useEffect(() => {
        const copyEl = heroCopyRef.current;
        const stackEl = heroStackRef.current;
        if (!copyEl || !stackEl) return;

        const checkFit = () => {
            for (const level of [0, 1, 2, 3] as const) {
                copyEl.dataset.fit = String(level);
                if (stackEl.scrollHeight <= copyEl.clientHeight + 2) {
                    setHeroFit(level);
                    return;
                }
            }
            setHeroFit(3);
        };

        checkFit();
        document.fonts?.ready?.then(checkFit).catch(() => {});
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(checkFit) : null;
        ro?.observe(copyEl);
        return () => ro?.disconnect();
    }, [partnerOne, partnerTwo, locationTitle, heroMessage]);

    // Muhurat petal burst timer on scratch card reveal (Module 92427 lines 323-328)
    useEffect(() => {
        if (!dateRevealed) return;
        setShowMuhuratPetals(true);
        const t = window.setTimeout(() => setShowMuhuratPetals(false), 5200);
        return () => window.clearTimeout(t);
    }, [dateRevealed]);

    // Floating RSVP pill observer (Module 92427 lines 329-364)
    useEffect(() => {
        const btn = floatBtnRef.current;
        if (btn) {
            setFloatSticky(Boolean(findScrollContainer(btn)));
        }
        const coverEl = coverRef.current;
        const rsvpEl = rsvpSectionRef.current;
        if (typeof IntersectionObserver === 'undefined' || !coverEl) return;

        let coverInView = true;
        let rsvpInView = false;
        const update = () => setFloatVisible(!coverInView && !rsvpInView);

        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.target === coverEl) coverInView = entry.isIntersecting;
                    else if (entry.target === rsvpEl) rsvpInView = entry.isIntersecting;
                }
                update();
            },
            { threshold: 0.08 }
        );
        io.observe(coverEl);
        if (rsvpEl) io.observe(rsvpEl);
        return () => io.disconnect();
    }, []);

    const handleCopyAddress = () => {
        if (!fullVenueLine || typeof navigator === 'undefined' || !navigator.clipboard) return;
        navigator.clipboard
            .writeText(fullVenueLine)
            .then(() => {
                setCopiedAddr(true);
                window.setTimeout(() => setCopiedAddr(false), 1800);
            })
            .catch(() => {});
    };

    const preloadUrls = useMemo(
        () => [
            `${ART_BASE}/parda-arch.webp`,
            `${ART_BASE}/parda-curtain.webp`,
            `${ART_BASE}/parda-rope-tassel.webp`,
            `${ART_BASE}/hero-scene.webp`,
            `${ART_BASE}/toran-swag.webp`,
        ],
        []
    );

    const monogram = `${partnerOne.trim()[0] || ''} · ${partnerTwo.trim()[0] || ''}`.trim();

    const mainCalendarArgs = {
        title: `${partnerOne} & ${partnerTwo}'s Wedding`,
        date: weddingDateIso,
        location: fullVenueLine,
        description: heroMessage,
    };

    return (
        <main className="published-page template-preview-page saat-phere-root">
            <WebsiteTemplateFonts />

            <div className={SP_CLASSES.site} style={SAAT_PHERE_THEME_VARS}>
                {/* 0. STICKY OVERLAYS: PRELOADER + INTERACTIVE PARDA CURTAIN PULL */}
                <div className={SP_CLASSES.overlays}>
                    <PreloaderOverlay
                        monogram={monogram}
                        WatchUrls={preloadUrls}
                        className={SP_CLASSES.preloader}
                    />
                    <PardaOpening />
                </div>

                {/* 1. HERO SECTION (#cover) */}
                <section
                    ref={coverRef}
                    className={SP_CLASSES.hero}
                    id="cover"
                    style={{ position: 'relative', overflow: 'hidden' }}
                >
                    <SectionDivider
                        src={`${ART_BASE}/toran-swag.webp`}
                        height="clamp(34px, 10cqw, 76px)"
                        width="116%"
                        className={SP_CLASSES.toran}
                    />

                    <CornerSprig
                        src={`${ART_BASE}/corner-floral.webp`}
                        corner="top-left"
                        widthPct={32}
                        zIndex={4}
                        className={SP_CLASSES.cornerFloral}
                    />
                    <CornerSprig
                        src={`${ART_BASE}/corner-floral.webp`}
                        corner="top-right"
                        widthPct={32}
                        zIndex={4}
                        className={SP_CLASSES.cornerFloral}
                    />

                    <AmbientPetalCanvas
                        count={7}
                        colors={['#F08C1A', '#F2B33D', '#D14D7E', '#F7CDD3']}
                        speed={0.3}
                        wind={0.14}
                        sizeRange={[5, 11]}
                        opacityRange={[0.35, 0.72]}
                        zIndex={6}
                        className={SP_CLASSES.petals}
                    />

                    <div className={SP_CLASSES.heroScene}>
                        <img
                            src={`${ART_BASE}/hero-scene.webp`}
                            alt=""
                            aria-hidden="true"
                            className={SP_CLASSES.scene}
                            decoding="async"
                            fetchPriority="high"
                        />

                        <div
                            ref={heroCopyRef}
                            className={SP_CLASSES.heroCopy}
                            data-fit={heroFit}
                        >
                            <div ref={heroStackRef} className={SP_CLASSES.heroStack}>
                                <span className={SP_CLASSES.heroKicker}>An invitation</span>
                                <h1 className={SP_CLASSES.names}>
                                    <span className={SP_CLASSES.nameLine}>{partnerOne}</span>
                                    <span className={SP_CLASSES.amp} aria-hidden="true">
                                        &amp;
                                    </span>
                                    <span className={SP_CLASSES.nameLine}>{partnerTwo}</span>
                                </h1>
                                {locationTitle && (
                                    <p className={SP_CLASSES.heroDate}>
                                        <span className={SP_CLASSES.heroWhere}>{locationTitle}</span>
                                    </p>
                                )}
                                {heroMessage && (
                                    <p className={SP_CLASSES.heroTagline}>{heroMessage}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <span className={SP_CLASSES.scrollHint} aria-hidden="true">
                        Scroll
                    </span>
                </section>

                {/* 2. SHUBH MUHURAT — INTERACTIVE GOLD-FOIL SCRATCH CARD (#muhurat) */}
                {dateParts && (
                    <section className={SP_CLASSES.muhurat} id="muhurat">
                        <span className={SP_CLASSES.eyebrow}>
                            <span className={SP_CLASSES.deva} lang="hi">
                                शुभ मुहूर्त
                            </span>
                            <span className={SP_CLASSES.eyebrowLatin}>The auspicious day</span>
                        </span>

                        <div className={SP_CLASSES.muhuratStack}>
                            {showMuhuratPetals && (
                                <AmbientPetalCanvas
                                    count={26}
                                    colors={['#F2B33D', '#C9973B', '#D14D7E', '#F08C1A']}
                                    speed={1.35}
                                    wind={0.28}
                                    sizeRange={[7, 15]}
                                    opacityRange={[0.6, 0.95]}
                                    zIndex={4}
                                    className={SP_CLASSES.muhuratPetals}
                                />
                            )}

                            <OrnateFrame
                                borderImage={`${ART_BASE}/frame-ornate.webp`}
                                slice="84 86"
                                thickness="clamp(16px, 5.2cqw, 34px)"
                                padding="clamp(18px, 5.5cqw, 34px) clamp(20px, 6cqw, 38px)"
                                className={SP_CLASSES.plaquePanel}
                            >
                                <ScratchToReveal
                                    foilImage={`${ART_BASE}/date-foil.webp`}
                                    foilColor="#C9973B"
                                    brushPx={40}
                                    threshold={0.45}
                                    hint="Scratch with your finger to reveal the wedding date"
                                    onScratchStart={() => setScratchStarted(true)}
                                    onReveal={() => setDateRevealed(true)}
                                    className={SP_CLASSES.plaqueScratch}
                                >
                                    <time
                                        dateTime={weddingDateIso}
                                        className={[
                                            SP_CLASSES.plaque,
                                            dateRevealed ? SP_CLASSES.plaqueRevealed : '',
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                    >
                                        <span className={SP_CLASSES.plaqueWeekday}>{dateParts.weekday}</span>
                                        <span className={SP_CLASSES.plaqueDay}>{dateParts.day}</span>
                                        <span className={SP_CLASSES.plaqueMonth}>
                                            {dateParts.month} {dateParts.year}
                                        </span>
                                    </time>
                                </ScratchToReveal>
                            </OrnateFrame>

                            {!dateRevealed && (
                                <p
                                    aria-hidden="true"
                                    className={[
                                        SP_CLASSES.muhuratHint,
                                        scratchStarted ? SP_CLASSES.hintFaded : '',
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                >
                                    Scratch away the gold
                                </p>
                            )}

                            <p className={SP_CLASSES.srOnly} role="status" aria-live="polite">
                                {dateRevealed ? `Wedding date revealed: ${formattedDateLong}` : ''}
                            </p>
                        </div>
                    </section>
                )}

                {/* 3. COUNTDOWN BAND ("Until the first phera") */}
                <section className={SP_CLASSES.countdownBand} aria-label="Countdown to the wedding">
                    <span className={SP_CLASSES.eyebrow}>Until the first phera</span>
                    <div
                        className={[
                            SP_CLASSES.countdownStack,
                            dateRevealed ? SP_CLASSES.countdownPulse : '',
                        ]
                            .filter(Boolean)
                            .join(' ')}
                    >
                        <img
                            src={`${ART_BASE}/countdown-ornament.webp`}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                            className={SP_CLASSES.countdownRing}
                        />
                        <CountdownTimer targetDate={weddingDateIso} className={SP_CLASSES.countdown} />
                    </div>
                </section>

                {/* 4. THE INVITATION (#invite) */}
                <section
                    className={SP_CLASSES.invite}
                    id="invite"
                    style={{ position: 'relative', overflow: 'hidden' }}
                >
                    <PaperTextureOverlay
                        src={`${ART_BASE}/paper-texture.webp`}
                        tilePx={300}
                        opacity={0.55}
                        blend="multiply"
                    />
                    <DecorEntrance from="left" distance={22} rotateFrom={-5}>
                        <CornerSprig
                            src={`${ART_BASE}/corner-floral.webp`}
                            corner="top-left"
                            widthPct={24}
                            className={SP_CLASSES.inviteFloral}
                        />
                    </DecorEntrance>
                    <DecorEntrance from="right" distance={22} rotateFrom={5} delay={120}>
                        <CornerSprig
                            src={`${ART_BASE}/corner-floral.webp`}
                            corner="top-right"
                            widthPct={24}
                            className={SP_CLASSES.inviteFloral}
                        />
                    </DecorEntrance>

                    <span className={SP_CLASSES.eyebrow}>
                        <span className={SP_CLASSES.deva} lang="hi">
                            ॥ शुभ विवाह ॥
                        </span>
                        <span className={SP_CLASSES.eyebrowLatin}>The invitation</span>
                    </span>

                    <OrnateFrame
                        borderImage={`${ART_BASE}/frame-ornate.webp`}
                        slice="84 86"
                        thickness="clamp(16px, 5.2cqw, 34px)"
                        padding="clamp(22px, 6.5cqw, 44px) clamp(18px, 5.5cqw, 38px)"
                        className={SP_CLASSES.panel}
                    >
                        <img
                            src={`${ART_BASE}/motif-kalash.webp`}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                            className={SP_CLASSES.panelMotif}
                        />
                        <p className={SP_CLASSES.inviteText}>{invitationMessage}</p>
                    </OrnateFrame>
                </section>

                {/* 5. WITH THE BLESSINGS OF OUR FAMILIES (#families) */}
                <section
                    className={SP_CLASSES.families}
                    id="families"
                    style={{ position: 'relative', overflow: 'hidden' }}
                >
                    <DecorEntrance from="bottom" distance={18} scaleFrom={0.9}>
                        <CornerSprig
                            src={`${ART_BASE}/motif-kalash.webp`}
                            corner="bottom-right"
                            widthPct={20}
                            offsetPx={8}
                            className={SP_CLASSES.familiesMotif}
                        />
                    </DecorEntrance>

                    <span className={SP_CLASSES.eyebrow}>With the blessings of our families</span>

                    <div className={SP_CLASSES.familyGrid}>
                        <div className={SP_CLASSES.familyCard}>
                            <span className={SP_CLASSES.familyRole}>Daughter of</span>
                            <p className={SP_CLASSES.familyName}>{partnerOneParents}</p>
                        </div>
                        <span className={SP_CLASSES.familyKnot} aria-hidden="true">
                            &amp;
                        </span>
                        <div className={SP_CLASSES.familyCard}>
                            <span className={SP_CLASSES.familyRole}>Son of</span>
                            <p className={SP_CLASSES.familyName}>{partnerTwoParents}</p>
                        </div>
                    </div>

                    <p className={SP_CLASSES.blessing}>{familyBlessing}</p>
                </section>

                {/* 6. EVERY CELEBRATION — OUR EVENTS (#events) */}
                <section
                    className={SP_CLASSES.events}
                    id="events"
                    style={{ position: 'relative', overflow: 'hidden' }}
                >
                    <PaperTextureOverlay
                        src={`${ART_BASE}/paper-texture.webp`}
                        tilePx={300}
                        opacity={0.45}
                        blend="multiply"
                    />
                    <SectionDivider
                        src={`${ART_BASE}/toran-swag.webp`}
                        height="clamp(28px, 8cqw, 56px)"
                        width="110%"
                        className={SP_CLASSES.eventsToran}
                    />

                    <span className={SP_CLASSES.eyebrow}>Every celebration</span>
                    <h2 className={SP_CLASSES.heading}>Our Events</h2>

                    <div className={SP_CLASSES.eventList}>
                        {eventsList.map((ev, idx) => {
                            const formattedWhen = [formatLongDate(ev.date), formatTime12h(ev.time)]
                                .filter(Boolean)
                                .join(' · ');
                            const calArgs = {
                                title: `${partnerOne} & ${partnerTwo} — ${ev.name}`,
                                date: ev.date || weddingDateIso,
                                time: ev.time,
                                location: ev.venue || fullVenueLine,
                                description: ev.desc,
                            };
                            const isFirst = idx === 0;
                            const isLast = idx === eventsList.length - 1 && eventsList.length > 1;
                            const swatches = (ev.dressCodeColors || []).map(getSwatchLabel);

                            return (
                                <article
                                    key={`${ev.name}-${idx}`}
                                    className={SP_CLASSES.eventCard}
                                    style={{ position: 'relative', overflow: 'hidden' }}
                                >
                                    {(isFirst || isLast) && (
                                        <DecorEntrance
                                            from={isFirst ? 'left' : 'right'}
                                            distance={18}
                                            rotateFrom={isFirst ? -4 : 4}
                                        >
                                            <CornerSprig
                                                src={`${ART_BASE}/corner-floral.webp`}
                                                corner={isFirst ? 'top-left' : 'bottom-right'}
                                                widthPct={26}
                                                className={SP_CLASSES.eventSprig}
                                            />
                                        </DecorEntrance>
                                    )}

                                    <OrnateFrame
                                        borderImage={`${ART_BASE}/frame-ornate.webp`}
                                        slice="84 86"
                                        thickness="clamp(14px, 4.4cqw, 28px)"
                                        padding="clamp(18px, 5cqw, 30px) clamp(16px, 4.6cqw, 28px)"
                                        className={SP_CLASSES.eventFrame}
                                    >
                                        <img
                                            src={resolveCeremonyMotif(ev.name)}
                                            alt=""
                                            aria-hidden="true"
                                            loading="lazy"
                                            decoding="async"
                                            className={SP_CLASSES.eventMotif}
                                        />
                                        <h3 className={SP_CLASSES.eventName}>{ev.name}</h3>
                                        {formattedWhen && (
                                            <p className={SP_CLASSES.eventWhen}>{formattedWhen}</p>
                                        )}
                                        {ev.venue && (
                                            <p className={SP_CLASSES.eventVenue}>{ev.venue}</p>
                                        )}
                                        {ev.desc && (
                                            <p className={SP_CLASSES.eventDesc}>{ev.desc}</p>
                                        )}

                                        {swatches.length > 0 && (
                                            <div className={SP_CLASSES.dress} aria-label="Suggested colours">
                                                <span className={SP_CLASSES.dressLabel}>Wear</span>
                                                <ul className={SP_CLASSES.dressList}>
                                                    {swatches.map((sw, sIdx) => (
                                                        <li
                                                            key={`${sw.color}-${sIdx}`}
                                                            className={SP_CLASSES.dressChip}
                                                        >
                                                            <span
                                                                className={SP_CLASSES.dressDot}
                                                                style={{ background: sw.color }}
                                                                aria-hidden="true"
                                                            />
                                                            <span>{sw.label}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div className={SP_CLASSES.eventActions}>
                                            <a
                                                href={buildGoogleCalendarHref(calArgs)}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <svg viewBox="0 0 16 16" aria-hidden="true">
                                                    <rect
                                                        x="2"
                                                        y="3.2"
                                                        width="12"
                                                        height="10.8"
                                                        rx="1.6"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.3"
                                                    />
                                                    <path
                                                        d="M2 6.4h12M5.2 1.8v2.6M10.8 1.8v2.6"
                                                        stroke="currentColor"
                                                        strokeWidth="1.3"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                Add to calendar
                                            </a>
                                            {ev.venue && (
                                                <a
                                                    href={buildGoogleMapsHref(ev.venue)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <svg viewBox="0 0 16 16" aria-hidden="true">
                                                        <path
                                                            d="M8 1.6a4.6 4.6 0 0 0-4.6 4.6c0 3.4 4.6 8.2 4.6 8.2s4.6-4.8 4.6-8.2A4.6 4.6 0 0 0 8 1.6Zm0 6.4a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6Z"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.3"
                                                        />
                                                    </svg>
                                                    Map
                                                </a>
                                            )}
                                        </div>
                                    </OrnateFrame>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* 7. OUR STORY (#story) */}
                <section
                    className={SP_CLASSES.story}
                    id="story"
                    style={{ position: 'relative', overflow: 'hidden' }}
                >
                    <DecorEntrance from="bottom" distance={22} scaleFrom={0.9}>
                        <CornerSprig
                            src={`${ART_BASE}/couple-cutout.webp`}
                            corner="bottom-left"
                            widthPct={32}
                            offsetPx={4}
                            className={SP_CLASSES.storyCouple}
                        />
                    </DecorEntrance>

                    <span className={SP_CLASSES.eyebrow}>Our Story</span>

                    <OrnateFrame
                        borderImage={`${ART_BASE}/frame-ornate.webp`}
                        slice="84 86"
                        thickness="clamp(16px, 5.2cqw, 34px)"
                        padding="clamp(22px, 6.5cqw, 44px) clamp(18px, 5.5cqw, 38px)"
                        className={SP_CLASSES.panel}
                    >
                        <p className={SP_CLASSES.storyText}>{storyText}</p>
                        <p className={SP_CLASSES.storyHashtag}>{hashtag}</p>
                    </OrnateFrame>
                </section>

                {/* 8. KITNA JAANTE HO? — TRIVIA QUIZ (#trivia) */}
                <section
                    className={SP_CLASSES.band}
                    id="trivia"
                    style={{ position: 'relative', overflow: 'hidden' }}
                >
                    <OrnateFrame
                        borderImage={`${ART_BASE}/frame-ornate.webp`}
                        slice="84 86"
                        thickness="clamp(16px, 5.2cqw, 34px)"
                        padding="clamp(22px, 6.5cqw, 44px) clamp(18px, 5.5cqw, 38px)"
                        className={SP_CLASSES.panel}
                    >
                        <TriviaSection
                            partnerOne={partnerOne}
                            partnerTwo={partnerTwo}
                            chrome="none"
                            eyebrow="Kitna Jaante Ho?"
                        />
                    </OrnateFrame>
                </section>

                {/* 9. A FEW FAVOURITES — OUR GALLERY (#gallery) */}
                <section className={SP_CLASSES.gallery} id="gallery">
                    <span className={SP_CLASSES.eyebrow}>A few favourites</span>
                    <h2 className={SP_CLASSES.heading}>Our Gallery</h2>

                    <div
                        className={SP_CLASSES.galleryGrid}
                        style={{ '--sp-gallery-cols': Math.min(galleryPhotos.length, 2) } as React.CSSProperties}
                    >
                        {galleryPhotos.map((src, idx) => {
                            const isOddLast =
                                galleryPhotos.length > 2 &&
                                galleryPhotos.length % 2 === 1 &&
                                idx === galleryPhotos.length - 1;
                            const isZoomed = zoomedGalleryIdx === idx;
                            return (
                                <figure
                                    key={`${src}-${idx}`}
                                    className={[
                                        SP_CLASSES.frame,
                                        isOddLast || isZoomed ? SP_CLASSES.frameSpan : '',
                                        isZoomed ? SP_CLASSES.frameZoom : '',
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                    role="button"
                                    tabIndex={0}
                                    aria-pressed={isZoomed}
                                    aria-label={isZoomed ? 'Shrink photo' : 'Enlarge photo'}
                                    onClick={() => setZoomedGalleryIdx(isZoomed ? null : idx)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setZoomedGalleryIdx(isZoomed ? null : idx);
                                        }
                                    }}
                                >
                                    <img
                                        src={src}
                                        alt={`${partnerOne} & ${partnerTwo}`}
                                        loading="lazy"
                                    />
                                </figure>
                            );
                        })}
                    </div>
                </section>

                {/* 10. BEFORE YOU SET OUT — THINGS TO KNOW (#travel) */}
                <section className={SP_CLASSES.travel} id="travel">
                    <span className={SP_CLASSES.eyebrow}>Before you set out</span>
                    <h2 className={SP_CLASSES.heading}>Things to Know</h2>

                    <div className={SP_CLASSES.infoGrid}>
                        <div className={SP_CLASSES.infoCard}>
                            <div className={SP_CLASSES.infoHead}>
                                <svg viewBox="0 0 20 20" aria-hidden="true">
                                    <path
                                        d="M2.5 11.5 17 4l-4.5 13-2.6-5.1L2.5 11.5Z"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <h3>Travel</h3>
                            </div>
                            <p>
                                The venue is an easy drive from the main road, and cabs are simple to
                                find. Tell us if you need help planning your journey.
                            </p>
                        </div>

                        <div className={SP_CLASSES.infoCard}>
                            <div className={SP_CLASSES.infoHead}>
                                <svg viewBox="0 0 20 20" aria-hidden="true">
                                    <path
                                        d="M2.5 15.5v-8M17.5 15.5v-5.5a2 2 0 0 0-2-2H9v5M2.5 13h15M5.8 9.2a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <h3>Where to stay</h3>
                            </div>
                            <p>
                                We have held a block of rooms at a hotel close by — mention our names
                                when you book for the group rate.
                            </p>
                        </div>

                        <div className={SP_CLASSES.infoCard}>
                            <div className={SP_CLASSES.infoHead}>
                                <svg viewBox="0 0 20 20" aria-hidden="true">
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="7.4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                    />
                                    <path
                                        d="M8.2 13.5v-7h2.6a2.1 2.1 0 0 1 0 4.2H8.2"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <h3>Parking</h3>
                            </div>
                            <p>
                                Parking is available at the gate and our team will guide you in when you
                                arrive.
                            </p>
                        </div>
                    </div>

                    {fullVenueLine && (
                        <div className={SP_CLASSES.venueRow}>
                            <p className={SP_CLASSES.venueAddr}>{fullVenueLine}</p>
                            <div className={SP_CLASSES.venueActions}>
                                <button
                                    type="button"
                                    onClick={handleCopyAddress}
                                    className={SP_CLASSES.ghostBtn}
                                >
                                    {copiedAddr ? 'Copied' : 'Copy address'}
                                </button>
                                <a
                                    href={buildGoogleMapsHref(fullVenueLine)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={SP_CLASSES.ghostBtn}
                                >
                                    Open map
                                </a>
                            </div>
                        </div>
                    )}
                </section>

                {/* 11. JOIN THE CELEBRATION — WILL YOU JOIN US? (#rsvp) */}
                <section
                    ref={rsvpSectionRef}
                    className={SP_CLASSES.rsvp}
                    id="rsvp"
                    style={{ position: 'relative', overflow: 'hidden' }}
                >
                    <DecorEntrance from="bottom" distance={20} rotateFrom={-4}>
                        <CornerSprig
                            src={`${ART_BASE}/corner-floral.webp`}
                            corner="bottom-left"
                            widthPct={26}
                            className={SP_CLASSES.rsvpFloral}
                        />
                    </DecorEntrance>

                    <span className={SP_CLASSES.eyebrow}>Join the celebration</span>
                    <h2 className={SP_CLASSES.heading}>Will you join us?</h2>

                    <div className={SP_CLASSES.rsvpCard}>
                        <p className={SP_CLASSES.rsvpIntro}>
                            Nothing would fill this courtyard more completely than having you in it.
                        </p>

                        {data.step === 'SUCCESS' ? (
                            <p className="rsvp-thanks" role="status">
                                धन्यवाद! We can&apos;t wait to celebrate with you.
                            </p>
                        ) : (
                            <form className="rsvp-form" onSubmit={data.handleSubmit}>
                                <div className="rsvp-toggle" role="radiogroup" aria-label="Will you attend?">
                                    <button
                                        type="button"
                                        className={data.status === 'attending' ? 'is-active' : ''}
                                        onClick={() => data.setStatus('attending')}
                                        aria-pressed={data.status === 'attending'}
                                    >
                                        Joyfully attending
                                    </button>
                                    <button
                                        type="button"
                                        className={data.status === 'declined' ? 'is-active' : ''}
                                        onClick={() => data.setStatus('declined')}
                                        aria-pressed={data.status === 'declined'}
                                    >
                                        Sadly, can&apos;t make it
                                    </button>
                                </div>

                                <label>
                                    <span>Your name *</span>
                                    <input
                                        type="text"
                                        required
                                        value={data.guestName}
                                        onChange={(e) => data.setGuestName(e.target.value)}
                                        placeholder="Full name"
                                    />
                                </label>

                                <div className="rsvp-row">
                                    <label>
                                        <span>Phone</span>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => data.setPhone(e.target.value)}
                                            placeholder="10-digit mobile"
                                        />
                                    </label>
                                    {data.status === 'attending' && (
                                        <label>
                                            <span>Guests</span>
                                            <select
                                                value={data.adultCount}
                                                onChange={(e) => {
                                                    const next = Number(e.target.value);
                                                    const diff = next - data.adultCount;
                                                    if (diff > 0) {
                                                        for (let i = 0; i < diff; i++) data.incrementGuests();
                                                    } else if (diff < 0) {
                                                        for (let i = 0; i < Math.abs(diff); i++) data.decrementGuests();
                                                    }
                                                }}
                                            >
                                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                                    <option key={n} value={n}>
                                                        {n} {n === 1 ? 'guest' : 'guests'}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    )}
                                </div>

                                <label>
                                    <span>A note or blessing</span>
                                    <textarea
                                        rows={2}
                                        value={data.message}
                                        onChange={(e) => data.setMessage(e.target.value)}
                                        placeholder="Send your wishes to the couple"
                                    />
                                </label>

                                {data.submitError && (
                                    <p className="rsvp-error" role="alert">
                                        {data.submitError}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="rsvp-submit"
                                    disabled={data.isSubmitting}
                                >
                                    {data.isSubmitting ? 'Sending…' : 'Send RSVP'}
                                </button>
                            </form>
                        )}
                    </div>
                </section>

                {/* 12. WITH WARM REGARDS (#regards) */}
                <section className={SP_CLASSES.band} id="regards">
                    <RegardsSection
                        note="Awaiting your gracious presence — the Sharma & Verma families"
                        people={[
                            { name: 'Mr. Rajesh Sharma', phone: '98100 00000' },
                            { name: 'Mrs. Sunita Sharma', phone: '98200 00000' },
                            { name: 'Mr. Anil Verma' },
                        ]}
                    />
                </section>

                {/* 13. FINALE FOOTER (footer.finale) */}
                <footer
                    className={SP_CLASSES.finale}
                    style={{ position: 'relative', overflow: 'hidden' }}
                >
                    <SectionDivider
                        src={`${ART_BASE}/toran-swag.webp`}
                        height="clamp(26px, 7.5cqw, 52px)"
                        width="110%"
                        className={SP_CLASSES.finaleToran}
                    />

                    <div className={SP_CLASSES.diyaLamp} aria-hidden="true">
                        <img
                            src={`${ART_BASE}/motif-diya.webp`}
                            alt=""
                            loading="lazy"
                            decoding="async"
                        />
                    </div>

                    <p className={SP_CLASSES.hashtag}>{hashtag}</p>
                    <p className={SP_CLASSES.finaleNames}>
                        {partnerOne} &amp; {partnerTwo}
                    </p>
                    {formattedDateShort && (
                        <p className={SP_CLASSES.finaleStamp}>{formattedDateShort}</p>
                    )}

                    <div className={SP_CLASSES.calRow}>
                        <a
                            href={buildGoogleCalendarHref(mainCalendarArgs)}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Google Calendar
                        </a>
                        <span aria-hidden="true">·</span>
                        <a
                            href={buildIcsHref(mainCalendarArgs)}
                            download={`${partnerOne}-${partnerTwo}-wedding.ics`}
                        >
                            Apple / iCal
                        </a>
                    </div>

                    <a href="/" className={SP_CLASSES.credit}>
                        <span>Crafted with</span>
                        <span className={SP_CLASSES.creditBrand}>Nimantran Studio</span>
                    </a>
                </footer>

                {/* 14. FLOATING RSVP PILL BUTTON */}
                <button
                    ref={floatBtnRef}
                    type="button"
                    className={[
                        SP_CLASSES.floatRsvp,
                        floatSticky ? SP_CLASSES.floatSticky : SP_CLASSES.floatFixed,
                        floatVisible ? SP_CLASSES.floatOpen : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    aria-label="Jump to RSVP"
                    onClick={() =>
                        rsvpSectionRef.current?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                        })
                    }
                >
                    RSVP
                </button>
            </div>

            {/* 15. FLOATING MUSIC TOGGLE */}
            <MusicToggle src={audioSrc} />
        </main>
    );
}
