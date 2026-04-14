export type PlayerIdentity = "male" | "female" | "unspecified";

export type PartnerId = "A" | "B" | "C";

export type Stats = {
  affection: number; // Tình cảm
  trust: number; // Tin tưởng
  knowledge: number; // Hiểu biết
};

export type StoryEventId =
  | "e_checkIn"
  | "e_redFlag"
  | "e_safetyPlan";

export type ChoiceEffect = Partial<Stats> & {
  setPartner?: PartnerId;
  setIdentity?: PlayerIdentity;
};

export type ChoiceRequirement = Partial<{
  minAffection: number;
  minTrust: number;
  minKnowledge: number;
}>;

export type StatPredicate = Partial<{
  minAffection: number;
  maxAffection: number;
  eqAffection: number;
  minTrust: number;
  maxTrust: number;
  eqTrust: number;
  minKnowledge: number;
  maxKnowledge: number;
  eqKnowledge: number;
}>;

export type Choice = {
  id: string;
  label: string;
  next: StoryNodeId;
  effect?: ChoiceEffect;
  requires?: ChoiceRequirement;
};

export type StoryNode = {
  id: StoryNodeId;
  title: string;
  body: string[];
  choices: Choice[];
  isEnding?: boolean;
};

export type StoryNodeId =
  | "start"
  | "chooseIdentity"
  | "choosePartner"
  | "phaseGettingToKnow"
  | "phaseGettingToKnow_result"
  | "startDating"
  | "choosePlace"
  | "placeCafe"
  | "placePark"
  | "placePrivate"
  | "intimacy1"
  | "intimacy2"
  | "learnMore"
  | "pressureCheck"
  | "endingGood"
  | "endingMid"
  | "endingBad";

export const PARTNER_TRAITS: Record<PartnerId, { name: string; vibe: string }> = {
  A: { name: "A", vibe: "vui vẻ, năng động" },
  B: { name: "B", vibe: "học giỏi, điềm tĩnh" },
  C: { name: "C", vibe: "bí ẩn, ít nói" },
};

export const INITIAL_STATS: Stats = {
  affection: 0,
  trust: 0,
  knowledge: 0,
};

export type GameState = {
  mode: "story" | "event";
  nodeId: StoryNodeId;
  identity: PlayerIdentity | null;
  partner: PartnerId | null;
  stats: Stats;
  history: StoryNodeId[];
  seenEvents: StoryEventId[];
  activeEventId?: StoryEventId;
  resumeTo?: StoryNodeId;
};

export const INITIAL_STATE: GameState = {
  mode: "story",
  nodeId: "start",
  identity: null,
  partner: null,
  stats: INITIAL_STATS,
  history: [],
  seenEvents: [],
};

export function clampStat(n: number) {
  return Math.max(-3, Math.min(6, n));
}

export function applyEffect(state: GameState, effect: ChoiceEffect | undefined): GameState {
  if (!effect) return state;
  return {
    ...state,
    identity: effect.setIdentity ?? state.identity,
    partner: effect.setPartner ?? state.partner,
    stats: {
      affection: clampStat(state.stats.affection + (effect.affection ?? 0)),
      trust: clampStat(state.stats.trust + (effect.trust ?? 0)),
      knowledge: clampStat(state.stats.knowledge + (effect.knowledge ?? 0)),
    },
  };
}

export function meetsRequirement(stats: Stats, req: ChoiceRequirement | undefined) {
  if (!req) return true;
  if (req.minAffection != null && stats.affection < req.minAffection) return false;
  if (req.minTrust != null && stats.trust < req.minTrust) return false;
  if (req.minKnowledge != null && stats.knowledge < req.minKnowledge) return false;
  return true;
}

export function matchesPredicate(stats: Stats, pred: StatPredicate | undefined) {
  if (!pred) return true;

  if (pred.eqAffection != null && stats.affection !== pred.eqAffection) return false;
  if (pred.minAffection != null && stats.affection < pred.minAffection) return false;
  if (pred.maxAffection != null && stats.affection > pred.maxAffection) return false;

  if (pred.eqTrust != null && stats.trust !== pred.eqTrust) return false;
  if (pred.minTrust != null && stats.trust < pred.minTrust) return false;
  if (pred.maxTrust != null && stats.trust > pred.maxTrust) return false;

  if (pred.eqKnowledge != null && stats.knowledge !== pred.eqKnowledge) return false;
  if (pred.minKnowledge != null && stats.knowledge < pred.minKnowledge) return false;
  if (pred.maxKnowledge != null && stats.knowledge > pred.maxKnowledge) return false;

  return true;
}

export type StoryEvent = {
  id: StoryEventId;
  title: string;
  body: string[];
  when: StatPredicate;
  oncePerRun?: boolean;
  forced?: boolean;
  effect?: ChoiceEffect;
};

// Một số “sự kiện đặc biệt” có điều kiện theo chỉ số.
// - forced=true: bắt buộc xảy ra khi đạt điều kiện.
// - forced=false/undefined: không bắt buộc (người chơi có thể bỏ qua).
export const EVENTS: StoryEvent[] = [
  {
    id: "e_checkIn",
    title: "Sự kiện: Check-in cảm xúc",
    body: [
      "Bạn chợt nhận ra: mối quan hệ đang tiến nhanh.",
      "Bạn tự hỏi: “Mình đang thoải mái thật sự, hay chỉ đang cố làm hài lòng đối phương?”",
      "Bạn quyết định dành 10 phút để tự kiểm tra ranh giới và nhu cầu của mình.",
    ],
    when: { eqAffection: 1, minTrust: 1, minKnowledge: 1 },
    oncePerRun: true,
    forced: false,
    effect: { knowledge: 1 },
  },
  {
    id: "e_redFlag",
    title: "Sự kiện: Dấu hiệu đỏ",
    body: [
      "Một câu nói khiến bạn khựng lại: “Nếu yêu thì phải chứng minh chứ.”",
      "Bạn thấy áp lực tăng lên, nhưng cũng hiểu rằng ép buộc/điều kiện hoá tình yêu không phải là tôn trọng.",
      "Bạn có thể chọn dừng lại để làm rõ ranh giới, hoặc bỏ qua (nhưng rủi ro tăng).",
    ],
    when: { minAffection: 3, maxTrust: 0, maxKnowledge: 2 },
    oncePerRun: true,
    forced: false,
    effect: { knowledge: 1, trust: 1 },
  },
  {
    id: "e_safetyPlan",
    title: "Sự kiện: Kế hoạch an toàn",
    body: [
      "Bạn chủ động nói về đồng thuận và an toàn trước khi mọi thứ đi xa.",
      "Hai bạn thống nhất: tôn trọng ranh giới, nói rõ khi không thoải mái, và không làm gì khi thiếu kiến thức/chuẩn bị.",
      "Bạn thấy mình vững vàng hơn vì quyết định có kế hoạch thay vì “cầu may”.",
    ],
    when: { minTrust: 3, minKnowledge: 3 },
    oncePerRun: true,
    forced: true,
    effect: { trust: 1, knowledge: 1 },
  },
];

export function pickTriggeredEvent(state: GameState): StoryEvent | null {
  for (const e of EVENTS) {
    if (e.oncePerRun && state.seenEvents.includes(e.id)) continue;
    if (matchesPredicate(state.stats, e.when)) return e;
  }
  return null;
}

export function resolveNext(
  currentNodeId: StoryNodeId,
  choice: Choice | undefined,
  stateAfterEffect: GameState,
): StoryNodeId {
  if (!choice) return stateAfterEffect.nodeId;

  // Làm “hậu quả” cụ thể hơn dựa trên stats + lựa chọn.
  if (currentNodeId === "intimacy2" && choice.id === "int2_yes") {
    const { knowledge, trust } = stateAfterEffect.stats;
    if (knowledge >= 4 && trust >= 2) return "endingGood";
    if (knowledge >= 2) return "endingMid";
    return "endingBad";
  }

  if (currentNodeId === "pressureCheck" && choice.id === "pressure") {
    const { trust, knowledge } = stateAfterEffect.stats;
    // Nếu bạn có hiểu biết cao, bạn có xu hướng thoát khỏi áp lực sớm hơn.
    if (knowledge >= 4 && trust >= 1) return "endingGood";
    return "endingMid";
  }

  return choice.next;
}

export const STORY: Record<StoryNodeId, StoryNode> = {
  start: {
    id: "start",
    title: "Your Body, Your Story",
    body: [
      "Bạn vào vai một học sinh cấp 3.",
      "Đây không phải bài giảng — mà là một hành trình nhập vai, nơi mỗi lựa chọn đều có hậu quả.",
      "Mục tiêu: tôn trọng bản thân, không bị ép buộc, và có hiểu biết để an toàn.",
    ],
    choices: [
      { id: "start_begin", label: "Bắt đầu hành trình", next: "chooseIdentity" },
    ],
  },

  chooseIdentity: {
    id: "chooseIdentity",
    title: "Chọn nhân vật của bạn",
    body: [
      "Bạn muốn nhập vai như thế nào?",
      "Bạn có thể thay đổi lựa chọn này bằng cách chơi lại về sau.",
    ],
    choices: [
      { id: "id_male", label: "Nam", next: "choosePartner", effect: { setIdentity: "male" } },
      { id: "id_female", label: "Nữ", next: "choosePartner", effect: { setIdentity: "female" } },
      {
        id: "id_unspecified",
        label: "Chưa xác định",
        next: "choosePartner",
        effect: { setIdentity: "unspecified" },
      },
    ],
  },

  choosePartner: {
    id: "choosePartner",
    title: "Mở đầu: chọn người yêu",
    body: [
      "Tại trường, bạn để ý một người.",
      "Mỗi lựa chọn sẽ ảnh hưởng đến cách họ cư xử sau này.",
    ],
    choices: [
      {
        id: "pA",
        label: "Chọn A (vui vẻ, năng động)",
        next: "phaseGettingToKnow",
        effect: { setPartner: "A", affection: 1 },
      },
      {
        id: "pB",
        label: "Chọn B (học giỏi, điềm tĩnh)",
        next: "phaseGettingToKnow",
        effect: { setPartner: "B", trust: 1 },
      },
      {
        id: "pC",
        label: "Chọn C (bí ẩn, ít nói)",
        next: "phaseGettingToKnow",
        effect: { setPartner: "C", affection: 1, trust: -1 },
      },
    ],
  },

  phaseGettingToKnow: {
    id: "phaseGettingToKnow",
    title: "Giai đoạn tìm hiểu (1–3 tháng)",
    body: [
      "Các tình huống lặp lại: nhắn tin mỗi ngày, đi học cùng nhau, đôi khi đi chơi nhóm.",
      "Bạn chọn cách ứng xử như thế nào?",
    ],
    choices: [
      {
        id: "care_moderate",
        label: "Quan tâm vừa phải (tôn trọng không gian riêng)",
        next: "phaseGettingToKnow_result",
        effect: { affection: 1, trust: 1, knowledge: 1 },
      },
      {
        id: "care_a_lot",
        label: "Quan tâm nhiều (nhắn tin liên tục, luôn muốn kiểm soát)",
        next: "phaseGettingToKnow_result",
        effect: { affection: 2, trust: -1 },
      },
      {
        id: "care_cold",
        label: "Thờ ơ (ít trả lời, ít chủ động)",
        next: "phaseGettingToKnow_result",
        effect: { affection: -1, trust: -1 },
      },
    ],
  },

  phaseGettingToKnow_result: {
    id: "phaseGettingToKnow_result",
    title: "Sau vài tháng",
    body: [
      "Mối quan hệ dần rõ ràng hơn.",
      "Bạn bắt đầu nhận ra: cảm xúc, niềm tin và hiểu biết đều quan trọng — không chỉ “thích là đủ”.",
    ],
    choices: [{ id: "toDating", label: "Tiếp tục", next: "startDating" }],
  },

  startDating: {
    id: "startDating",
    title: "Bắt đầu hẹn hò",
    body: ['Người yêu nhắn: “Cuối tuần này đi chơi riêng nhé?”'],
    choices: [
      { id: "date_yes", label: "Đồng ý ngay", next: "choosePlace", effect: { affection: 1 } },
      { id: "date_ask", label: "Hỏi thêm (đi đâu, mấy giờ, về thế nào)", next: "choosePlace", effect: { trust: 1, knowledge: 1 } },
      { id: "date_no", label: "Từ chối (chưa sẵn sàng)", next: "choosePlace", effect: { trust: 1 } },
    ],
  },

  choosePlace: {
    id: "choosePlace",
    title: "Chọn địa điểm",
    body: ["Bạn muốn hẹn ở đâu? Mỗi nơi mở ra tình huống khác nhau."],
    choices: [
      { id: "place_cafe", label: "A: Quán cà phê", next: "placeCafe", effect: { knowledge: 1 } },
      { id: "place_park", label: "B: Công viên", next: "placePark", effect: { affection: 1 } },
      { id: "place_private", label: "C: Nơi riêng tư (nhà/phòng riêng)", next: "placePrivate", effect: { trust: -1 } },
    ],
  },

  placeCafe: {
    id: "placeCafe",
    title: "Quán cà phê",
    body: [
      "Không gian công cộng khiến cuộc trò chuyện tự nhiên và an toàn hơn.",
      "Bạn để ý mình dễ nói “không” hơn khi xung quanh có người.",
    ],
    choices: [{ id: "toInt1_cafe", label: "Tiếp tục", next: "intimacy1" }],
  },

  placePark: {
    id: "placePark",
    title: "Công viên",
    body: [
      "Gió nhẹ, tiếng cười, khoảng cách giữa hai người gần hơn.",
      "Thỉnh thoảng có khoảnh khắc im lặng — nhưng không khó chịu.",
    ],
    choices: [{ id: "toInt1_park", label: "Tiếp tục", next: "intimacy1" }],
  },

  placePrivate: {
    id: "placePrivate",
    title: "Nơi riêng tư",
    body: [
      "Không gian riêng khiến cảm xúc dễ “tăng tốc”.",
      "Bạn thấy hơi áp lực vì mọi thứ diễn ra nhanh hơn bạn tưởng.",
    ],
    choices: [
      { id: "toInt1_private", label: "Tiếp tục", next: "intimacy1", effect: { affection: 1 } },
      { id: "learn_before", label: "Dừng lại một chút — mình muốn tìm hiểu thêm trước", next: "learnMore", effect: { knowledge: 1, trust: 1 } },
    ],
  },

  intimacy1: {
    id: "intimacy1",
    title: "Hành động thân mật ban đầu",
    body: [
      "Người yêu có hành động thân mật: nắm tay → ôm → hôn nhẹ.",
      "Bạn phản ứng thế nào?",
    ],
    choices: [
      { id: "int1_yes", label: "Đồng ý (mình thấy ổn)", next: "intimacy2", effect: { affection: 1 } },
      { id: "int1_shy", label: "Ngại ngùng (mình cần chậm lại)", next: "intimacy2", effect: { trust: 1, knowledge: 1 } },
      { id: "int1_no", label: "Từ chối (mình không thoải mái)", next: "pressureCheck", effect: { trust: 1 } },
    ],
  },

  intimacy2: {
    id: "intimacy2",
    title: "Tình huống cao hơn",
    body: ['Người yêu nói nhỏ: “Chúng mình có thể thân mật hơn không?”'],
    choices: [
      {
        id: "int2_yes",
        label: "A: Đồng ý",
        next: "endingBad",
        effect: { affection: 1, trust: -1 },
        requires: { minAffection: -3 },
      },
      {
        id: "int2_learn",
        label: "C: Muốn tìm hiểu thêm trước (an toàn, quyền cá nhân, hậu quả)",
        next: "learnMore",
        effect: { knowledge: 2, trust: 1 },
      },
      { id: "int2_no", label: "B: Từ chối", next: "pressureCheck", effect: { trust: 1 } },
    ],
  },

  learnMore: {
    id: "learnMore",
    title: "Nội dung giáo dục (ngắn gọn)",
    body: [
      "Bạn tự hỏi: “Mình có thật sự muốn không? Hay vì sợ mất người đó?”",
      "Một vài điều cốt lõi:",
      "• Quyền cá nhân: bạn có quyền nói “không”, quyền đổi ý, quyền đặt ranh giới.",
      "• An toàn: thân mật cần sự đồng thuận rõ ràng và hiểu biện pháp bảo vệ.",
      "• Hậu quả: thiếu hiểu biết có thể dẫn đến lo lắng, rủi ro mang thai ngoài ý muốn, bệnh lây truyền, tổn thương tâm lý.",
    ],
    choices: [
      {
        id: "learn_back",
        label: "Quay lại tình huống (mình sẵn sàng nói chuyện rõ ràng)",
        next: "pressureCheck",
        effect: { knowledge: 1, trust: 1 },
      },
    ],
  },

  pressureCheck: {
    id: "pressureCheck",
    title: "Tôn trọng hay gây áp lực?",
    body: [
      "Bạn đặt ranh giới. Phản ứng của người yêu sẽ quyết định rất nhiều.",
      "Bạn quan sát thấy họ…",
    ],
    choices: [
      {
        id: "respect",
        label: "Tôn trọng: hỏi bạn muốn gì và dừng lại khi bạn không thoải mái",
        next: "endingGood",
        effect: { trust: 2, knowledge: 1 },
        requires: { minTrust: 0 },
      },
      {
        id: "pressure",
        label: "Gây áp lực: “Ai yêu cũng vậy”, “Nếu không thì chia tay”",
        next: "endingMid",
        effect: { trust: -2, affection: -1 },
      },
      {
        id: "talk",
        label: "Bạn đề nghị nói chuyện thẳng thắn về ranh giới và an toàn",
        next: "endingGood",
        effect: { trust: 1, knowledge: 2 },
        requires: { minKnowledge: 2 },
      },
    ],
  },

  endingGood: {
    id: "endingGood",
    title: "Kết thúc tốt: Biết bảo vệ bản thân",
    body: [
      "Bạn hiểu ranh giới của mình và dám nói ra.",
      "Người yêu tôn trọng bạn (hoặc bạn đủ tỉnh táo để rời khỏi áp lực).",
      "Thông điệp: tôn trọng bản thân + đồng thuận + hiểu biết = an toàn.",
    ],
    isEnding: true,
    choices: [{ id: "restart_good", label: "Chơi lại (thử nhánh khác)", next: "start" }],
  },

  endingMid: {
    id: "endingMid",
    title: "Kết thúc trung bình: Thiếu rõ ràng",
    body: [
      "Bạn vẫn giữ được một phần ranh giới, nhưng có lúc bị cuốn theo cảm xúc hoặc áp lực.",
      "Bạn nhận ra cần thêm kiến thức và kỹ năng giao tiếp để an toàn hơn.",
      "Gợi ý: thử chọn “tìm hiểu thêm” sớm hơn để xem khác biệt.",
    ],
    isEnding: true,
    choices: [{ id: "restart_mid", label: "Chơi lại", next: "start" }],
  },

  endingBad: {
    id: "endingBad",
    title: "Kết thúc xấu: Quyết định thiếu an toàn",
    body: [
      "Bạn đồng ý khi chưa thật sự hiểu rõ và chưa chuẩn bị.",
      "Sau đó là lo lắng: “Mình có an toàn không?”, “Có thể mang thai không?”, “Nếu có chuyện xảy ra thì sao?”",
      "Thông điệp: cảm xúc quan trọng, nhưng hiểu biết và đồng thuận mới giúp bạn an toàn.",
    ],
    isEnding: true,
    choices: [{ id: "restart_bad", label: "Chơi lại (lần này ưu tiên an toàn)", next: "start" }],
  },
};

