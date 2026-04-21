import type { Scenario } from "@/lib/story-format";
import { MINH_LAN_ASSETS } from "@/lib/scenarios/minh-lan.assets";

export const MINH_LAN_SCENARIO: Scenario = {
  slug: "minh-lan",
  title: "Minh & Lan",
  tagline: "Từ rung động đến ranh giới",

  roleplay: {
    as: "Bạn vào vai Minh (17 tuổi, học sinh lớp 11). Bạn gặp Lan (21 tuổi, sinh viên năm 3).",
    summary:
      "Một câu chuyện nhập vai về cảm xúc, an toàn và nhận thức — nơi mỗi lựa chọn đều làm thay đổi chỉ số và mở khóa tuyến truyện.",
    mainCharacterId: "minh",
  },

  characters: [
    { id: "minh", name: "Minh", age: 17, bio: "Học sinh lớp 11." },
    { id: "lan", name: "Lan", age: 21, bio: "Sinh viên năm 3." },
    { id: "huy", name: "Huy", bio: "Bạn của Minh." },
    { id: "tuan", name: "Tuân", bio: "Bạn cùng lớp của Minh (thẳng tính, hay quan sát)." },
    { id: "bo", name: "Bố Minh", bio: "Ít nói nhưng rất quan tâm." },
    { id: "me", name: "Mẹ Minh", bio: "Nhạy cảm và để ý cảm xúc của con." },
    { id: "co_ha", name: "Cô Hà", bio: "Giáo viên chủ nhiệm (điềm tĩnh, tôn trọng riêng tư)." },
  ],
  assets: MINH_LAN_ASSETS,
  initialNameOverrides: { lan: "Cô gái lạ" },

  stats: [
    { id: "A", label: "Nhận thức", min: 0, max: 100 },
    { id: "S", label: "Cảm xúc", shortLabel: "E", min: 0, max: 100 },
    { id: "E", label: "Tin tưởng", shortLabel: "T", min: 0, max: 100 },
    { id: "T", label: "Áp lực", shortLabel: "P", min: 0, max: 100 },
    { id: "R", label: "Ranh giới", shortLabel: "B", min: 0, max: 100 },
  ],
  initialStats: { A: 30, S: 40, E: 20, T: 20, R: 50 },

  flags: [
    { id: "red", label: "RedFlag", tone: "bad" },
    { id: "green", label: "GreenFlag", tone: "good" },
  ],
  initialFlags: { red: 0, green: 0 },

  routes: [
    {
      id: "aware",
      label: "Aware Route",
      description: "Mở thêm lựa chọn phân tích, phát hiện bất thường sớm.",
      unlockWhen: {
        all: [
          { stat: { key: "A", op: ">=", value: 50 } },
          { flag: { key: "green", op: ">=", value: 2 } },
        ],
      },
    },
  ],

  startNodeId: "scene0_home",
  nodes: {
    scene0_home: {
      id: "scene0_home",
      kind: "scene",
      backgroundId: "kitchen",
      title: "PROLOGUE – Ở NHÀ",
      body: [
        "Những ngày cuối học kỳ luôn có một nhịp riêng: sáng đến lớp, chiều học thêm, tối vùi trong bài tập.",
        "Ở nhà, mẹ Minh để ý từng thay đổi nhỏ, còn bố Minh không nói nhiều nhưng luôn quan sát.",
        "Minh cố tỏ ra bình thường, nhưng áp lực học hành đã bắt đầu bám theo vào cả bữa ăn gia đình.",
      ],
      lines: [
        { text: "Những ngày cuối học kỳ luôn có một nhịp riêng: sáng đến lớp, chiều học thêm, tối vùi trong bài tập." },
        { speakerId: "me", text: "Con ăn sáng cho đàng hoàng. Đừng vừa đi vừa nhai bánh mì." },
        { speakerId: "bo", text: "Thi cử quan trọng, nhưng sức khỏe cũng quan trọng." },
        { speakerId: "minh", text: "(Mình không muốn bố mẹ lo… nhưng dạo này lúc nào cũng thấy căng.)" },
        { text: "Minh khoác balo, rời nhà. Buổi sáng ở trường vẫn đang chờ phía trước." },
      ],
      choices: [{ id: "s0h_next", label: "Đến trường", next: "scene0" }],
    },

    scene0: {
      id: "scene0",
      kind: "scene",
      backgroundId: "schoolGate",
      title: "PROLOGUE – NHỮNG NGÀY BÌNH THƯỜNG",
      body: [
        "Minh (lớp 11) không phải học sinh tệ, nhưng Minh hay tự gây áp lực. Minh sợ cảm giác ‘tụt lại’, sợ bị gắn mác lười, sợ làm bố mẹ thất vọng.",
        "Tuân và Huy là hai người Minh vẫn nói chuyện nhiều nhất ở lớp. Một người thẳng tính, một người ít lời nhưng tinh.",
        "Minh nghĩ mình hiểu thế giới của mình khá rõ… cho tới khi một người lạ bước vào và làm nhịp mọi thứ đổi khác.",
      ],
      lines: [
        { text: "Ở cổng trường, tiếng xe cộ và tiếng gọi nhau khiến buổi sáng luôn rộn ràng." },
        { speakerId: "tuan", text: "Mày ôn tới đâu rồi? Mấy bữa nữa kiểm tra đó." },
        { speakerId: "minh", text: "Tao đang cố… mà càng gần ngày càng căng." },
        { speakerId: "huy", text: "Căng thì càng phải ngủ đủ. Đừng thức khuya chơi game nữa." },
        { speakerId: "minh", text: "(Mình cứ nghĩ cuộc sống sẽ lặp y như vậy…)" },
        { text: "Chiều đó, Minh ghé quán cà phê gần trường để học. Và lần đầu tiên, Minh gặp một ‘người lạ’." },
      ],
      choices: [{ id: "s0_next", label: "Tiếp tục", next: "scene1" }],
    },

    scene1: {
      id: "scene1",
      kind: "scene",
      backgroundId: "coffee",
      title: "SCENE 1 – QUÁN CÀ PHÊ",
      body: [
        "Chiều muộn, quán cà phê gần trường hơi ồn: tiếng muỗng chạm ly, tiếng máy xay, vài nhóm bạn cười khúc khích.",
        "Minh chọn một góc khuất gần cửa sổ. Ánh sáng vàng khiến trang vở trông ‘dễ thở’ hơn, nhưng bài tập thì vẫn khó như thường.",
        "Kỳ kiểm tra sắp tới làm Minh căng thẳng. Minh không sợ điểm kém bằng sợ cảm giác ‘mình đang tụt lại’ so với bạn bè.",
        "Minh tự nhủ: hôm nay phải học. Không được phân tâm.",
        "Rồi Minh cảm thấy có ánh mắt nhìn sang. Không phải kiểu soi mói, mà giống một sự tò mò dịu dàng.",
        "Ở bàn bên, một cô gái ngồi một mình. Trẻ hơn Minh tưởng, ăn mặc gọn gàng, và có vẻ tự tin theo cách của người đã ‘qua’ tuổi học sinh.",
        "Cô gái mỉm cười nhẹ, nghiêng đầu như thể hai người đã quen từ lâu:",
        "“Em học lớp mấy? Nhìn căng thẳng thế.”",
        "Minh khựng lại vài giây. Một phần thấy vui vì được chú ý, một phần lại thấy hơi bất an vì khoảng cách tuổi và sự chủ động của người lạ.",
        "Minh bỗng nghĩ: nếu mình trả lời, mọi thứ sẽ bắt đầu. Và một khi bắt đầu, mình có kiểm soát được nhịp đi không?",
      ],
      lines: [
        { text: "Chiều muộn, quán cà phê gần trường hơi ồn: tiếng muỗng chạm ly, tiếng máy xay, vài nhóm bạn cười khúc khích." },
        { text: "Minh chọn một góc gần cửa sổ. Ánh sáng vàng làm trang vở trông ‘dễ thở’ hơn, nhưng bài tập thì vẫn khó." },
        { speakerId: "minh", text: "(Học đi. Đừng phân tâm. Kiểm tra tới nơi rồi…)" },
        { speakerId: "minh", text: "(Mình không sợ điểm kém… mình sợ cảm giác tụt lại.)" },
        {
          text: "Ở bàn bên, cô gái lạ thỉnh thoảng nhìn sang. Ánh mắt không quá lộ liễu, chỉ như một sự tò mò… nhưng Minh vẫn cảm nhận được.",
        },
        { text: "Cô gái ngồi một mình. Tư thế ung dung, giọng nói bình thản như người quen với việc chủ động." },
        { speakerId: "lan", text: "Em học lớp mấy? Nhìn căng thẳng thế." },
        { speakerId: "minh", text: "(Nếu mình trả lời… đây sẽ không chỉ là một câu xã giao.)" },
        {
          speakerId: "minh",
          text: "(Mình thấy vui vì được chú ý. Nhưng sao mình cũng thấy hơi… không yên?)",
        },
      ],
      choices: [
        {
          id: "s1_a",
          label: "Cười, nói chuyện thoải mái",
          next: "scene1a",
          effect: { stats: { E: 5, T: 10 } },
          resultLine: { speakerId: "lan", text: "Em dễ thương ghê, nói chuyện với em làm chị thấy nhẹ đầu." },
        },
        {
          id: "s1_b",
          label: "Trả lời lịch sự, giữ khoảng cách",
          next: "scene1a",
          effect: { stats: { A: 5, S: 5 } },
          note: "🟢",
          resultLine: { speakerId: "minh", text: "Em chào chị nha, em đang cần tập trung học thêm chút." },
        },
        {
          id: "s1_c",
          label: "Trả lời qua loa rồi quay đi",
          next: "scene1a",
          effect: { stats: { T: -5 } },
          resultLine: { speakerId: "lan", text: "Ừm… chắc em bận. Chị không làm phiền nữa." },
        },
      ],
    },

    scene1a: {
      id: "scene1a",
      kind: "scene",
      backgroundId: "coffee",
      title: "SCENE 1A – TRAO ĐỔI LIÊN LẠC",
      body: [
        "Cuộc nói chuyện kéo dài hơn Minh tưởng. Người lạ hỏi han vừa đủ, không tra khảo, nhưng đủ để Minh thấy ‘được chú ý’.",
        "Minh vẫn chưa biết tên cô ấy. Minh chỉ biết: cô ấy lớn hơn, tự tin hơn, và có vẻ quen với việc dẫn nhịp.",
        "Trước khi rời quán, cô ấy hỏi xin liên lạc. Minh hiểu đây là khoảnh khắc ranh giới đầu tiên: đồng ý thì mọi thứ sẽ bước sang một nhịp khác.",
      ],
      lines: [
        { text: "Cuộc nói chuyện kéo dài hơn Minh tưởng. Người lạ hỏi han vừa đủ, không tra khảo, nhưng đủ để Minh thấy ‘được chú ý’." },
        { speakerId: "lan", text: "Em hay học ở đây à?" },
        { speakerId: "minh", text: "Dạ… thỉnh thoảng. Em muốn yên tĩnh để tập trung." },
        { speakerId: "lan", text: "Cho chị xin Instagram nhé. Có gì chị gửi tài liệu, hoặc… nói chuyện." },
        { speakerId: "minh", text: "(Mình còn chưa biết tên chị ấy… nhưng chị ấy đã muốn đi tiếp rất nhanh.)" },
        { text: "Minh do dự vài giây rồi mở điện thoại." },
      ],
      choices: [{ id: "s1a_next", label: "Tiếp tục", next: "scene2r" }],
    },

    scene2r: {
      id: "scene2r",
      kind: "scene",
      backgroundId: "bedroomNight",
      title: "SCENE 2 – INSTAGRAM (LỘ TÊN)",
      body: [
        "Tối đó, Minh mở Instagram. Trong danh sách follow mới, Minh thấy tài khoản vừa gửi yêu cầu.",
        "Minh giật mình: tên hiển thị là “Lan”. Vậy ra người lạ ở quán cà phê có tên như thế.",
        "Chỉ một cái tên thôi, nhưng cảm giác ‘xa lạ’ chuyển thành ‘cụ thể’ — và khi mọi thứ cụ thể, nó cũng dễ kéo người ta đi xa hơn.",
      ],
      lines: [
        { text: "Tối đó, Minh mở Instagram. Một yêu cầu follow hiện lên." },
        { speakerId: "minh", text: "(Tên… Lan.)" },
        { text: "Minh bỗng thấy kỳ lạ: vừa nhẹ nhõm vì biết tên, vừa hồi hộp vì mọi thứ đang tiến nhanh." },
      ],
      choices: [
        { id: "s2r_next", label: "Tiếp tục", next: "scene2", effect: { setNames: { lan: "Lan" } } },
      ],
    },

    scene2: {
      id: "scene2",
      kind: "scene",
      backgroundId: "classroom",
      title: "SCENE 2 – INSTAGRAM",
      body: [
        "Minh lướt Instagram như thói quen. Chưa kịp nghĩ nhiều, Lan đã rep story của Minh bằng một câu ngắn gọn nhưng đủ làm tim đập nhanh:",
        "“Dễ thương nhỉ.”",
        "Minh tự hỏi: đây chỉ là lời khen xã giao, hay là một tín hiệu muốn tiến xa hơn?",
        "Trong đầu Minh có hai luồng suy nghĩ song song: muốn được quan tâm, và muốn giữ vùng riêng an toàn.",
      ],
      lines: [
        { text: "Minh lướt Instagram như thói quen." },
        { speakerId: "minh", text: "(Mình biết tên rồi… nhưng mình vẫn chưa biết ‘ý định’.)" },
        { text: "Chưa kịp nghĩ nhiều, Lan đã rep story của Minh." },
        { speakerId: "lan", text: "Dễ thương nhỉ." },
        { speakerId: "minh", text: "(Khen vậy… là xã giao, hay là tín hiệu?)" },
      ],
      choices: [
        {
          id: "s2_a",
          label: "Share thêm chuyện cá nhân",
          next: "scene3",
          effect: { stats: { E: 10, R: -5 }, flags: { red: 1 } },
          note: "🔴",
          resultLine: { speakerId: "minh", text: "(Mình vừa kể hơi nhiều… liệu có quá nhanh không?)" },
        },
        {
          id: "s2_b",
          label: "Trả lời bình thường",
          next: "scene3",
          effect: { stats: { T: 5 } },
          resultLine: { speakerId: "minh", text: "Cảm ơn chị. Hôm nay em chỉ đăng linh tinh thôi." },
        },
        {
          id: "s2_c",
          label: "Giữ riêng tư",
          next: "scene3",
          effect: { stats: { A: 10, S: 5 }, flags: { green: 1 } },
          note: "🟢",
          resultLine: { speakerId: "minh", text: "Em ít đăng chuyện riêng lắm, em quen giữ cho mình." },
        },
      ],
    },

    scene3: {
      id: "scene3",
      kind: "scene",
      backgroundId: "classroom",
      title: "SCENE 3 – TIN NHẮN 0H",
      body: [
        "Nửa đêm. Minh đang nằm lướt điện thoại, mắt đã mỏi nhưng vẫn chưa ngủ được.",
        "Tin nhắn từ Lan bật lên như một tiếng gõ cửa vào sự riêng tư của buổi đêm:",
        "“Chưa ngủ à? Nói chuyện chút không?”",
        "Minh cảm thấy vừa được chú ý, vừa bị kéo khỏi nhịp sinh hoạt của mình.",
        "Một câu trả lời có thể biến việc này thành ‘thói quen’ — và thói quen thì rất khó thay đổi về sau.",
      ],
      lines: [
        { text: "Nửa đêm. Minh nằm lướt điện thoại, mắt đã mỏi nhưng vẫn chưa ngủ được." },
        { text: "Tin nhắn từ Lan bật lên như một tiếng gõ cửa vào sự riêng tư của buổi đêm." },
        { speakerId: "lan", text: "Chưa ngủ à? Nói chuyện chút không?" },
        { speakerId: "minh", text: "(Nếu mình trả lời ngay… liệu sau này đêm nào cũng vậy không?)" },
      ],
      choices: [
        { id: "s3_a", label: "Rep ngay", next: "scene3a", effect: { stats: { E: 10, S: -5 } } },
        {
          id: "s3_b",
          label: "Để sáng trả lời",
          next: "scene3a",
          effect: { stats: { S: 5 }, flags: { green: 1 } },
          note: "🟢",
          resultLine: { speakerId: "minh", text: "Em ngủ trước nha chị, mai sáng em trả lời kỹ hơn." },
        },
        {
          id: "s3_c",
          label: "Hỏi “có chuyện gì không?”",
          next: "scene3a",
          effect: { stats: { A: 5 } },
          resultLine: { speakerId: "lan", text: "Không có gì đâu, chị chỉ muốn biết em còn thức thôi." },
        },
      ],
    },

    scene3a: {
      id: "scene3a",
      kind: "scene",
      backgroundId: "classroom",
      title: "SCENE 3A – BUỔI SÁNG Ở TRƯỜNG",
      body: [
        "Sáng hôm sau, Minh đến lớp với đôi mắt hơi mỏi. Đầu óc như vẫn còn mắc kẹt ở cuộc trò chuyện đêm qua.",
        "Một vài câu hỏi tưởng nhỏ lại cứ lặp đi lặp lại: ‘Mình đang vui vì được quan tâm, hay đang bị kéo vào một nhịp mà mình không kiểm soát?’",
        "Giữa giờ, Tuân nhìn Minh một lúc rồi thở dài. Huy thì im hơn thường lệ.",
        "Minh bỗng nhận ra: đôi khi người ta không nhìn thấy rủi ro vì rủi ro đến trong hình dạng của sự ngọt ngào.",
      ],
      lines: [
        { text: "Sáng hôm sau, Minh đến lớp với đôi mắt hơi mỏi." },
        { speakerId: "tuan", text: "Đêm qua lại thức khuya hả? Mặt mày như mất ngủ mấy ngày rồi." },
        { speakerId: "minh", text: "Không… tao vẫn ổn." },
        { speakerId: "huy", text: "Ổn thì tốt. Nhưng nếu có gì, thì nói cho bọn tao nhé." },
        { speakerId: "minh", text: "(Mình sợ nhất không phải bị mọi người biết… mà là bị người kia giận.)" },
        { text: "Chuông vào tiết vang lên. Minh cất điện thoại, nhưng tay vẫn vô thức chạm vào túi áo." },
      ],
      choices: [{ id: "s3a_next", label: "Tiếp tục", next: "scene4" }],
    },

    scene4: {
      id: "scene4",
      kind: "scene",
      backgroundId: "schoolGate",
      title: "SCENE 4 – LẦN HẸN ĐẦU",
      body: [
        "Vài ngày sau, Lan nhắn: “Đi uống nước tối nay nhé?”",
        "Minh nhìn màn hình, tay chần chừ. Mình đang được ‘rủ hẹn’ — cảm giác ấy khiến Minh thấy trưởng thành hơn một chút.",
        "Nhưng cũng có một câu hỏi âm thầm: một cuộc hẹn đầu tiên nên diễn ra thế nào để mình vẫn an toàn và không bị cuốn đi quá nhanh?",
        "Minh nhận ra: đôi khi rủi ro không đến từ ‘một quyết định sai’, mà đến từ việc không kịp đặt câu hỏi trước khi bước tiếp.",
      ],
      lines: [
        { speakerId: "lan", text: "Đi uống nước tối nay nhé?" },
        { speakerId: "minh", text: "(Nghe như một lời mời bình thường… nhưng hẹn đầu tiên luôn quyết định nhịp đi.)" },
        { text: "Minh nhìn màn hình, tay chần chừ. Vừa thấy hào hứng, vừa thấy lo." },
        { speakerId: "minh", text: "(Mình muốn gặp… nhưng mình cũng cần một ‘khung an toàn’ cho chính mình.)" },
      ],
      choices: [
        {
          id: "s4_a",
          label: "Đi ngay, quán vắng",
          next: "scene5",
          effect: { stats: { E: 15, T: 10, S: -20 }, flags: { red: 1 } },
          note: "🔴",
        },
        {
          id: "s4_b",
          label: "Đổi sang quán đông, ban ngày",
          next: "scene5safe",
          effect: { stats: { S: 15, A: 5 }, flags: { green: 1 } },
          note: "🟢",
          resultLine: { speakerId: "minh", text: "Mình chọn chỗ đông người và ban ngày cho an toàn hơn." },
        },
        { id: "s4_c", label: "Từ chối", next: "scene5", effect: { stats: { S: 10, T: -5 } } },
        {
          id: "s4_d",
          label: "Hỏi rõ lý do",
          next: "scene5safe",
          effect: { stats: { A: 10 } },
          requires: { stat: { key: "A", op: ">=", value: 35 } },
          note: "🔒",
          resultLine: {
            speakerId: "minh",
            text: "Nếu đi gặp, mình cần biết rõ kế hoạch để tự bảo vệ bản thân.",
          },
        },
      ],
    },

    scene5safe: {
      id: "scene5safe",
      kind: "scene",
      backgroundId: "restaurantB",
      title: "SCENE 5 – QUÁN ĐÔNG (GIỮ NHỊP AN TOÀN)",
      body: [
        "Cuộc hẹn diễn ra ở một quán đông người, sáng sủa và nhiều bàn xung quanh.",
        "Không khí bớt ngột ngạt hơn, Minh thấy mình giữ được nhịp nói chuyện tốt hơn thay vì bị cuốn theo.",
        "Lan vẫn thử đẩy câu chuyện theo hướng thân mật, nhưng Minh bắt đầu chủ động đặt giới hạn rõ ràng hơn.",
      ],
      lines: [
        { text: "Buổi gặp diễn ra ở quán đông, ban ngày. Minh thấy mình bớt áp lực hơn." },
        { speakerId: "lan", text: "Em cẩn thận ghê, chọn chỗ đông người luôn." },
        { speakerId: "minh", text: "Em muốn cả hai thoải mái và tôn trọng ranh giới của nhau." },
        { speakerId: "lan", text: "Ừ… chị hiểu. Miễn em đừng xa cách quá là được." },
        { speakerId: "minh", text: "(Mình vẫn có cảm xúc, nhưng lần này mình không muốn bỏ quên sự an toàn.)" },
      ],
      choices: [
        {
          id: "s5safe_a",
          label: "Đáp lại vừa phải",
          next: "scene6",
          effect: { stats: { E: 8, S: 8 }, flags: { green: 1 } },
          note: "🟢",
        },
        {
          id: "s5safe_b",
          label: "Nhắc lại ranh giới",
          next: "scene6",
          effect: { stats: { A: 12, S: 10 }, flags: { green: 1 } },
          note: "🟢",
        },
        {
          id: "s5safe_c",
          label: "Im lặng cho qua",
          next: "scene6",
          effect: { stats: { T: 5 } },
        },
      ],
    },

    scene5: {
      id: "scene5",
      kind: "scene",
      backgroundId: "coffee",
      title: "SCENE 5 – KHÔNG KHÍ THÂN MẬT",
      body: [
        "Cuộc hẹn diễn ra trong một không gian khiến Minh vừa thấy gần gũi, vừa thấy ‘bị kéo’ theo nhịp của Lan.",
        "Trong lúc nói chuyện, Lan chủ động đưa tay nắm lấy tay Minh.",
        "Khoảnh khắc ấy rất nhỏ — nhưng đủ để chuyển một mối quan hệ từ ‘làm quen’ sang ‘thân mật’.",
        "Minh tự hỏi: mình thật sự thoải mái, hay chỉ sợ làm mất lòng?",
        "Một ranh giới không nói ra thường sẽ bị hiểu lầm là ‘đồng ý’.",
      ],
      lines: [
        { text: "Không khí buổi gặp khiến Minh vừa thấy gần gũi, vừa thấy bị kéo theo nhịp của Lan." },
        { text: "Trong lúc nói chuyện, Lan chủ động đưa tay nắm lấy tay Minh." },
        { speakerId: "minh", text: "(Khoảnh khắc này… mình thật sự thoải mái, hay chỉ sợ làm mất lòng?)" },
        { text: "Minh hiểu: ranh giới không nói ra thường bị hiểu lầm là đồng ý." },
      ],
      choices: [
        {
          id: "s5_a",
          label: "Đáp lại",
          next: "scene6",
          effect: { stats: { E: 20, S: -15 }, flags: { red: 1 } },
          note: "🔴",
        },
        {
          id: "s5_b",
          label: "Hỏi: “Chị thấy vậy ổn chứ?”",
          next: "scene6",
          effect: { stats: { A: 15, S: 10 }, flags: { green: 1 } },
          note: "🟢",
        },
        { id: "s5_c", label: "Rút tay", next: "scene6", effect: { stats: { S: 15, E: -5 } } },
      ],
    },

    scene6: {
      id: "scene6",
      kind: "scene",
      backgroundId: "kitchen",
      title: "SCENE 6 – “GIỮ BÍ MẬT NHÉ”",
      body: [
        "Sau vài lần gặp, Lan bắt đầu nói về ‘điều riêng tư’ giữa hai người.",
        "Một hôm, Lan nhìn Minh rồi nói như thể đó là điều bình thường:",
        "“Giữ bí mật nhé.”",
        "Minh thấy lạ. Bí mật đôi khi chỉ là sự riêng tư… nhưng đôi khi cũng là dấu hiệu của sự kiểm soát hoặc khiến mình khó tìm kiếm hỗ trợ khi cần.",
        "Minh phải phân biệt: cái gì đáng giữ cho riêng mình, và cái gì không nên bị buộc phải giấu.",
      ],
      lines: [
        { text: "Buổi tối hôm đó, Minh về nhà muộn hơn thường lệ." },
        { speakerId: "me", text: "Con ăn gì chưa? Mẹ hâm cơm nhé." },
        { speakerId: "minh", text: "Dạ… con ăn rồi ạ." },
        { text: "Điện thoại rung. Lan nhắn liên tục, rồi gọi video." },
        { speakerId: "lan", text: "Chuyện của hai đứa mình… em đừng kể ai nhé." },
        { speakerId: "minh", text: "(Vì sao phải giấu cả chuyện mình không thoải mái?)" },
        { speakerId: "me", text: "Minh, dạo này con hay thẫn thờ. Có chuyện gì không?" },
        { speakerId: "minh", text: "(Mình muốn nói… nhưng không biết bắt đầu từ đâu.)" },
      ],
      choices: [
        {
          id: "s6_a",
          label: "Đồng ý",
          next: "scene7",
          effect: { stats: { T: 10, R: -10 }, flags: { red: 1 } },
          note: "🔴",
        },
        {
          id: "s6_b",
          label: "Không thoải mái",
          next: "scene7",
          effect: { stats: { A: 10 } },
          note: "🟢",
        },
        { id: "s6_c", label: "Lưỡng lự", next: "scene7", effect: { stats: { T: 5 } } },
      ],
    },

    scene7: {
      id: "scene7",
      kind: "scene",
      backgroundId: "classroom",
      title: "SCENE 7 – NGƯỜI THỨ 3",
      body: [
        "Ở trường, Huy kéo Minh ra một góc, nói nhỏ:",
        "“Tao thấy chị đó hơi lạ…”",
        "Minh hơi khó chịu. Ai đó ‘đụng’ vào mối quan hệ của mình luôn khiến mình có xu hướng phòng vệ.",
        "Nhưng rồi Minh cũng nhớ ra: đôi khi người ngoài thấy được điều mà người trong cuộc bỏ qua vì đang bị cảm xúc che mắt.",
        "Câu hỏi là: mình có đủ bình tĩnh để nghe, hay mình sẽ tự đóng cửa?",
      ],
      lines: [
        { text: "Giờ ra chơi, Huy kéo Minh ra hành lang phía sau lớp." },
        { speakerId: "huy", text: "Tao không phán xét mày. Tao chỉ thấy mày dạo này khác lắm." },
        { speakerId: "minh", text: "Khác kiểu gì?" },
        { speakerId: "huy", text: "Mày bỏ đội bóng, ít nói chuyện, lúc nào cũng nhìn điện thoại." },
        { speakerId: "huy", text: "Tao thấy chị đó hơi lạ… kiểu lúc nào cũng muốn mày online." },
        { speakerId: "tuan", text: "Tao cũng thấy Minh hay xin ra ngoài để gọi điện." },
        { speakerId: "minh", text: "(Nghe thì khó chịu… nhưng tụi nó đâu nói sai.)" },
      ],
      choices: [
        { id: "s7_a", label: "Bỏ qua", next: "scene8", effect: { stats: { A: -5 }, flags: { red: 1 } }, note: "🔴" },
        { id: "s7_b", label: "Nghe thử", next: "scene8", effect: { stats: { A: 10 } }, note: "🟢" },
        {
          id: "s7_c",
          label: "Cắt liên lạc Huy",
          next: "scene8",
          effect: { stats: { R: -10 }, flags: { red: 1 } },
          note: "🔴",
        },
      ],
    },

    scene8: {
      id: "scene8",
      kind: "scene",
      backgroundId: "classroom",
      title: "SCENE 8 – LAN GHEN",
      body: [
        "Lan bắt đầu ghen. Ban đầu chỉ là những câu hỏi tưởng như quan tâm:",
        "“Em đi với ai?”, “Sao em trả lời tin nhắn chậm thế?”",
        "Nhưng dần dần, câu chuyện chuyển thành yêu cầu Minh ‘chứng minh’ rằng Minh chỉ ưu tiên Lan.",
        "Minh nhận ra một điều khó nói: ghen có thể là cảm xúc bình thường, nhưng cách xử lý ghen mới là thứ quyết định mối quan hệ an toàn hay độc hại.",
      ],
      lines: [
        { text: "Lan bắt đầu hỏi kỹ từng người Minh nhắn tin, từng buổi Minh đi đâu." },
        { speakerId: "lan", text: "Em mà bận thì nói chị, đừng để chị phải đoán." },
        { speakerId: "minh", text: "Em đi học thêm thôi mà." },
        { speakerId: "lan", text: "Nếu thương chị thì em phải ưu tiên chị chứ?" },
        { speakerId: "minh", text: "(Ưu tiên là một chuyện… kiểm soát lại là chuyện khác.)" },
        { text: "Minh cảm nhận rõ áp lực: mỗi phản ứng nhỏ đều có thể dẫn tới cãi vã." },
      ],
      choices: [
        { id: "s8_a", label: "Chiều theo", next: "scene9", effect: { stats: { T: 10, S: -10 }, flags: { red: 1 } }, note: "🔴" },
        { id: "s8_b", label: "Giải thích", next: "scene9", effect: { stats: { A: 10 }, flags: { green: 1 } }, note: "🟢" },
        { id: "s8_c", label: "Cãi lại", next: "scene9", effect: { stats: { R: -5 } } },
        {
          id: "s8_d",
          label: "Phân tích hành vi",
          next: "scene9",
          effect: { stats: { A: 15 } },
          requires: { route: { id: "aware", is: true } },
          note: "🔒",
        },
      ],
    },

    scene9: {
      id: "scene9",
      kind: "scene",
      backgroundId: "classroom",
      title: "SCENE 9 – HỌC TẬP",
      body: [
        "Minh bắt đầu mệt mỏi hơn. Có ngày Minh học không vào vì phải trả lời tin nhắn liên tục.",
        "Điểm số và sự tập trung tụt dần — không phải vì Minh kém đi, mà vì năng lượng bị kéo sang một nơi khác.",
        "Minh nhận ra: yêu đương không nên biến mình thành người bỏ quên tương lai của chính mình.",
        "Nhưng thay đổi thói quen cũng đồng nghĩa với việc đối mặt với phản ứng của Lan.",
      ],
      lines: [
        { text: "Một tuần kiểm tra giữa kỳ đến gần." },
        { speakerId: "co_ha", text: "Minh, kết quả kiểm tra gần đây của em giảm khá nhiều." },
        { speakerId: "co_ha", text: "Nếu có chuyện riêng, em có thể trao đổi. Đừng ôm một mình." },
        { speakerId: "minh", text: "Dạ… em sẽ cố cân bằng lại ạ." },
        { speakerId: "tuan", text: "Tối nay học nhóm nhé. Mày bỏ buổi nào là tao gọi tận nhà đó." },
        { speakerId: "minh", text: "(Mình đang bị kéo theo một thứ làm mình rời xa chính mình.)" },
      ],
      choices: [
        { id: "s9_a", label: "Bỏ học đi chơi", next: "scene9a", effect: { stats: { R: -15 }, flags: { red: 1 } }, note: "🔴" },
        { id: "s9_b", label: "Cân bằng lại", next: "scene9a", effect: { stats: { S: 10, R: 10 }, flags: { green: 1 } }, note: "🟢" },
        { id: "s9_c", label: "Giấu gia đình", next: "scene9a", effect: { stats: { S: -5 } } },
      ],
    },

    scene9a: {
      id: "scene9a",
      kind: "scene",
      backgroundId: "classroom",
      title: "SCENE 9A – HỌC NHÓM",
      body: [
        "Tối đó, Minh cố đến buổi học nhóm như một ‘điểm neo’ kéo mình trở lại nhịp sống bình thường.",
        "Trong phòng học nhỏ của nhà Tuân, bài vở nằm đó — nhưng điện thoại cũng nằm đó.",
        "Minh nhận ra: nếu mình không chủ động đặt ranh giới với thời gian và sự chú ý của mình, người khác sẽ đặt hộ.",
        "Bữa học nhóm không chỉ là học. Nó là một phép thử: Minh có dám ưu tiên tương lai của mình không?",
      ],
      lines: [
        { speakerId: "tuan", text: "Đặt điện thoại úp xuống đi. Học 45 phút, nghỉ 10 phút." },
        { speakerId: "minh", text: "Tao sợ… có tin nhắn gấp." },
        { speakerId: "tuan", text: "Cái gì gấp tới mức phá nát giấc ngủ với tương lai của mày?" },
        { speakerId: "huy", text: "Nếu người ta thương mày, người ta sẽ tôn trọng giờ học." },
        { speakerId: "minh", text: "(Mình nghe mà thấy nhói. Vì mình biết họ nói đúng.)" },
        { text: "Minh hít sâu. Lần đầu tiên, Minh thử để điện thoại yên thêm 10 phút." },
      ],
      choices: [{ id: "s9a_next", label: "Tiếp tục", next: "scene10" }],
    },

    scene10: {
      id: "scene10",
      kind: "scene",
      backgroundId: "classroom",
      title: "SCENE 10 – CHỦ ĐỀ NHẠY CẢM",
      body: [
        "Một lần gặp nhau, Lan chủ động đưa câu chuyện sang một chủ đề nhạy cảm hơn.",
        "Không phải mọi ‘thân mật’ đều sai. Nhưng bất kỳ điều gì liên quan đến cơ thể và ranh giới đều cần sự đồng thuận rõ ràng, kiến thức và sự chuẩn bị.",
        "Minh vừa tò mò, vừa sợ mình ‘tụt lại’ nếu không theo kịp.",
        "Minh tự hỏi: mình đang quyết định vì muốn, hay vì sợ mất?",
      ],
      lines: [
        { text: "Trong cuộc gọi tối muộn, Lan chủ động nói về chủ đề nhạy cảm." },
        { speakerId: "lan", text: "Chị nghĩ hai đứa đã đủ thân để tiến thêm rồi." },
        { speakerId: "minh", text: "Chị cho em thời gian suy nghĩ được không?" },
        { speakerId: "lan", text: "Suy nghĩ nhiều quá thì mất cảm xúc đó em." },
        { speakerId: "minh", text: "(Mất cảm xúc… hay mất ranh giới?)" },
        { text: "Minh mở tab mới, gõ tìm: quyền đồng thuận, ranh giới cá nhân, an toàn cảm xúc." },
      ],
      choices: [
        {
          id: "s10_a",
          label: "Đồng ý ngay",
          next: "scene11",
          effect: { stats: { E: 20, S: -25, A: -10 }, flags: { red: 1 } },
          note: "🔴",
        },
        {
          id: "s10_b",
          label: "Tìm hiểu trước",
          next: "scene11",
          effect: { stats: { A: 20, S: 10 }, flags: { green: 1 } },
          note: "🟢",
        },
        { id: "s10_c", label: "Từ chối", next: "scene11", effect: { stats: { S: 15, E: -10 } } },
        {
          id: "s10_d",
          label: "Tra cứu kỹ",
          next: "scene11",
          effect: { stats: { A: 25 } },
          requires: { route: { id: "aware", is: true } },
          note: "🔒",
        },
      ],
    },

    scene11: {
      id: "scene11",
      kind: "scene",
      backgroundId: "kitchen",
      title: "SCENE 11 – RỦ ĐI XA",
      body: [
        "Lan rủ Minh đi xa. Nghe có vẻ lãng mạn, nhưng Minh chợt nghĩ tới những điều đơn giản:",
        "Mình đi với ai? Ai biết mình ở đâu? Nếu có chuyện xảy ra, mình gọi ai?",
        "Không phải vì nghi ngờ Lan — mà vì tự bảo vệ bản thân là trách nhiệm của chính mình.",
      ],
      lines: [
        { speakerId: "lan", text: "Cuối tuần đi xa với chị nha, chỉ hai đứa thôi." },
        { speakerId: "minh", text: "Đi đâu vậy chị?" },
        { speakerId: "lan", text: "Đi rồi biết. Chị muốn em tin chị." },
        { speakerId: "bo", text: "Cuối tuần con định đi đâu? Bố chở đi nếu cần." },
        { speakerId: "minh", text: "(Nếu mình không nói cho ai biết, lúc có chuyện thì sao?)" },
      ],
      choices: [
        { id: "s11_a", label: "Đi mà không nói ai", next: "scene12", effect: { stats: { E: 15, S: -20 }, flags: { red: 1 } }, note: "🔴" },
        { id: "s11_b", label: "Báo gia đình", next: "scene12", effect: { stats: { S: 15, A: 5 }, flags: { green: 1 } }, note: "🟢" },
        { id: "s11_c", label: "Không đi", next: "scene12", effect: { stats: { S: 10 } } },
      ],
    },

    scene12: {
      id: "scene12",
      kind: "scene",
      backgroundId: "schoolGate",
      title: "SCENE 12 – DẤU HIỆU LẠ",
      body: [
        "Minh bắt đầu thấy những chi tiết nhỏ nhưng lặp đi lặp lại: cách Lan nói về người khác, cách Lan phản ứng khi Minh bận, cách Lan ‘định nghĩa’ tình yêu.",
        "Một dấu hiệu riêng lẻ có thể chỉ là hiểu lầm. Nhưng nhiều dấu hiệu ghép lại có thể là một bức tranh.",
        "Minh đứng trước một lựa chọn: bỏ qua để yên ổn, hay nhìn thẳng để rõ ràng.",
      ],
      lines: [
        { text: "Những chi tiết nhỏ bắt đầu ghép thành một bức tranh rõ hơn." },
        { speakerId: "tuan", text: "Mày ổn không? Dạo này mắt mày lúc nào cũng thiếu ngủ." },
        { speakerId: "minh", text: "Tao ổn… chắc vậy." },
        { speakerId: "tuan", text: "Không ổn thì cứ nói. Giữ im lặng lâu quá là tự làm mình mệt." },
        { speakerId: "minh", text: "(Mình không muốn thừa nhận, nhưng mình đang sợ phản ứng của chị ấy.)" },
      ],
      choices: [
        { id: "s12_a", label: "Bỏ qua", next: "scene13", effect: { stats: { E: 10, A: -10 }, flags: { red: 1 } }, note: "🔴" },
        { id: "s12_b", label: "Hỏi thẳng", next: "scene13", effect: { stats: { A: 10 }, flags: { green: 1 } }, note: "🟢" },
        { id: "s12_c", label: "Theo dõi", next: "scene13", effect: { stats: { S: -5 }, flags: { red: 1 } }, note: "🔴" },
      ],
    },

    scene13: {
      id: "scene13",
      kind: "scene",
      backgroundId: "classroom",
      title: "SCENE 13 – BỊ KIỂM SOÁT",
      body: [
        "Một tối, Lan hỏi Minh có thể cho xem điện thoại không — danh bạ, tin nhắn, thậm chí cả lịch sử chat.",
        "Lan nói đó là ‘để yên tâm’. Nhưng Minh cảm thấy không khí thay đổi: từ tin tưởng sang kiểm soát.",
        "Ranh giới là thứ chỉ hiện ra rõ nhất khi có người muốn bước qua nó.",
      ],
      lines: [
        { speakerId: "lan", text: "Cho chị xem điện thoại em chút đi. Không có gì thì ngại gì?" },
        { speakerId: "minh", text: "Đó là chuyện riêng của em…" },
        { speakerId: "lan", text: "Yêu nhau mà còn giữ riêng sao?" },
        { speakerId: "minh", text: "(Giữ riêng tư không có nghĩa là phản bội…)" },
        { text: "Minh thấy tim đập nhanh, tay lạnh đi. Đây không còn là trò đùa." },
      ],
      choices: [
        { id: "s13_a", label: "Cho xem", next: "scene14", effect: { stats: { S: -10 }, flags: { red: 1 } }, note: "🔴" },
        { id: "s13_b", label: "Từ chối", next: "scene14", effect: { stats: { S: 15 }, flags: { green: 1 } }, note: "🟢" },
        {
          id: "s13_c",
          label: "Phản biện",
          next: "scene14",
          effect: { stats: { A: 15, T: -10 } },
          requires: { stat: { key: "A", op: ">=", value: 60 } },
          note: "🔒",
        },
      ],
    },

    scene14: {
      id: "scene14",
      kind: "scene",
      backgroundId: "classroom",
      title: "SCENE 14 – ÁP LỰC “CHỨNG MINH”",
      body: [
        "Lan nói những câu khiến Minh khó thở:",
        "“Nếu yêu thì phải chứng minh.”",
        "Nhưng ‘chứng minh’ ở đây là gì? Là hy sinh điều mình cần? Là nhượng bộ ranh giới của mình?",
        "Minh nhận ra: tình yêu tốt không khiến người ta sợ hãi khi nói ‘không’.",
      ],
      lines: [
        { speakerId: "lan", text: "Nếu yêu thì phải chứng minh." },
        { speakerId: "minh", text: "Chứng minh bằng cách nào?" },
        { speakerId: "lan", text: "Bằng việc làm chị yên tâm. Bằng việc đừng từ chối chị." },
        { speakerId: "minh", text: "(Đây là yêu… hay là kiểm tra lòng trung thành?)" },
        { speakerId: "huy", text: "Mày không nợ ai bằng chứng để được tôn trọng." },
      ],
      choices: [
        { id: "s14_a", label: "Đồng ý", next: "scene15", effect: { stats: { E: 20, S: -20, A: -10 }, flags: { red: 1 } }, note: "🔴" },
        { id: "s14_b", label: "Từ chối", next: "scene15", effect: { stats: { S: 15, A: 10 }, flags: { green: 1 } }, note: "🟢" },
        { id: "s14_c", label: "Trì hoãn", next: "scene15", effect: { stats: { E: -5 } } },
      ],
    },

    scene15: {
      id: "scene15",
      kind: "scene",
      backgroundId: "kitchen",
      title: "SCENE 15 – KHỦNG HOẢNG",
      body: [
        "Mọi thứ dồn lại thành một khối nặng trong ngực Minh: vừa thương, vừa mệt, vừa hoang mang.",
        "Minh thấy mình thay đổi: nhạy cảm hơn, dễ tự trách hơn, và đôi khi đánh đổi sự an toàn chỉ để giữ cảm giác ‘được yêu’.",
        "Khủng hoảng không phải chỉ là cãi nhau — mà là lúc mình đối diện với câu hỏi: mình có đang đánh mất chính mình không?",
      ],
      lines: [
        { text: "Đêm đó, Minh ngồi một mình trong phòng, điện thoại sáng rồi tắt liên tục." },
        { speakerId: "me", text: "Con à, mẹ không cần biết hết. Mẹ chỉ cần con an toàn." },
        { speakerId: "minh", text: "Con… mệt quá mẹ ạ." },
        { speakerId: "me", text: "Mệt thì dừng. Dừng để thở cũng là một quyết định dũng cảm." },
        { speakerId: "minh", text: "(Có lẽ mình đã cố mạnh mẽ sai cách: tự chịu đựng một mình.)" },
      ],
      choices: [
        { id: "s15_a", label: "Tìm người giúp", next: "scene15a", effect: { stats: { A: 15, S: 10 }, flags: { green: 1 } }, note: "🟢" },
        { id: "s15_b", label: "Giữ trong lòng", next: "scene15a", effect: { stats: { E: 10 }, flags: { red: 1 } }, note: "🔴" },
        { id: "s15_c", label: "Đổ lỗi", next: "scene15a", effect: { stats: { R: -10 } } },
      ],
    },

    scene15a: {
      id: "scene15a",
      kind: "scene",
      backgroundId: "classroom",
      title: "SCENE 15A – NÓI CHUYỆN VỚI CÔ HÀ",
      body: [
        "Hôm sau, Minh bị gọi lên gặp cô Hà. Không phải để trách phạt — mà để hỏi xem Minh đang ‘mất’ gì trong những ngày gần đây.",
        "Có một điều lạ: khi người lớn hỏi nhẹ nhàng, Minh lại muốn khóc hơn là muốn cãi.",
        "Minh nhận ra mình đã quen với việc phòng vệ. Nhưng phòng vệ liên tục làm người ta kiệt sức.",
        "Cô Hà không ép Minh kể chi tiết. Cô chỉ giúp Minh đặt tên cho thứ Minh đang trải qua: áp lực, ranh giới, và quyền tự quyết.",
      ],
      lines: [
        { speakerId: "co_ha", text: "Cô không cần em kể hết. Cô chỉ muốn biết: em có đang thấy an toàn không?" },
        { speakerId: "minh", text: "Em… không chắc." },
        { speakerId: "co_ha", text: "Không chắc cũng là một tín hiệu." },
        { speakerId: "co_ha", text: "Trong một mối quan hệ, em có quyền nói ‘không’, quyền chậm lại, và quyền nhờ giúp đỡ." },
        { speakerId: "minh", text: "(Nghe đơn giản… nhưng sao mình lại quên điều đó?)" },
        { speakerId: "co_ha", text: "Nếu em muốn, cô sẽ giúp em nghĩ các bước cụ thể để bảo vệ mình." },
      ],
      choices: [{ id: "s15a_next", label: "Tiếp tục", next: "scene16" }],
    },

    scene16: {
      id: "scene16",
      kind: "scene",
      backgroundId: "schoolGate",
      title: "SCENE 16 – SỰ THẬT",
      body: [
        "Sự thật cuối cùng cũng dần lộ ra — không phải trong một ‘cú sốc’ duy nhất, mà qua nhiều chi tiết chồng lên nhau.",
        "Nếu Minh đã đủ tỉnh táo và có nhận thức cao, Minh sẽ nhận ra sớm hơn: cảm giác sai sai không phải là ‘mình nhạy cảm quá’, mà là dấu hiệu cần dừng lại để nhìn kỹ.",
        "Nếu không, Minh sẽ nhận ra muộn: khi đã lỡ đánh đổi quá nhiều thứ và phải trả giá bằng sự an toàn, danh dự hoặc tương lai.",
      ],
      lines: [
        { text: "Sự thật không ập đến trong một khoảnh khắc. Nó lộ ra qua từng lần Minh nhượng bộ." },
        { speakerId: "co_ha", text: "Em có quyền tìm hỗ trợ. Không ai phải tự xoay sở mãi." },
        { speakerId: "bo", text: "Con sai cũng được. Quan trọng là con dừng kịp để sửa." },
        { speakerId: "minh", text: "(Mình không còn muốn sống trong cảm giác nơm nớp nữa.)" },
      ],
      choices: [{ id: "s16_next", label: "Tiếp tục", next: "scene17" }],
    },

    scene17: {
      id: "scene17",
      kind: "scene",
      backgroundId: "schoolGate",
      title: "SCENE 17 – QUYẾT ĐỊNH",
      body: [
        "Minh đứng trước lựa chọn cuối cùng.",
        "Có những mối quan hệ không xấu vì ‘có người xấu’ — mà vì cách hai người va vào nhau khiến một người dần mất quyền tự quyết.",
        "Minh hiểu: đôi khi rời đi không phải là thất bại. Đó là một kỹ năng sống.",
        "Nhưng Minh cũng biết: thay đổi không chỉ đến từ cảm xúc — mà từ quyết định cụ thể và ranh giới rõ ràng.",
      ],
      lines: [
        { text: "Minh mở lại toàn bộ tin nhắn cũ. Từng câu chữ giờ hiện rõ một logic: ràng buộc, gây áp lực, và làm Minh tự nghi ngờ bản thân." },
        { speakerId: "minh", text: "Mình muốn bình yên, nhưng không muốn đánh đổi mình để lấy bình yên giả tạo." },
        { speakerId: "huy", text: "Dù mày chọn gì, đừng biến nỗi sợ thành kim chỉ nam." },
        { speakerId: "me", text: "Con chọn điều gì cũng được, miễn là con giữ được lòng tự trọng và sự an toàn." },
        { text: "Đến đây, quyết định không còn là chọn “ai đúng ai sai”, mà là chọn tương lai Minh muốn sống cùng." },
      ],
      choices: [
        { id: "s17_a", label: "Tiếp tục", next: "endingAuto" },
        { id: "s17_b", label: "Dừng", next: "endingAuto" },
        {
          id: "s17_c",
          label: "Đặt ranh giới",
          next: "endingAuto",
          requires: { stat: { key: "A", op: ">=", value: 60 } },
          note: "🔒",
        },
      ],
    },

    endingAuto: {
      id: "endingAuto",
      kind: "ending",
      title: "KẾT THÚC",
      body: [
        "Minh hít một hơi thật sâu.",
        "Có những khoảnh khắc, chỉ cần một lựa chọn thôi cũng đủ để thay đổi quỹ đạo của cả một năm học — thậm chí cả cách mình nhìn về tình yêu.",
        "Đang tổng hợp kết quả...",
      ],
      choices: [{ id: "restart", label: "Chơi lại từ đầu", next: "scene1" }],
    },

    endingGood: {
      id: "endingGood",
      kind: "ending",
      title: "GOOD END – TRƯỞNG THÀNH",
      body: [
        "Minh chọn cách không để cảm xúc dẫn đường một mình.",
        "Minh học cách nói ra điều mình cần: an toàn, tôn trọng, và quyền được chậm lại.",
        "Lan có thể đồng ý, có thể không — nhưng Minh không còn đo giá trị của bản thân bằng việc ‘giữ được’ một người.",
        "Bài học của Minh không phải là ‘đừng yêu’, mà là: yêu mà vẫn giữ được mình.",
        "Một mối quan hệ tốt không bắt bạn chứng minh bằng sự hy sinh ranh giới. Nó được xây bằng giao tiếp rõ ràng và sự tôn trọng lẫn nhau.",
        "",
        "Vẫn còn những ending khác. Bạn có muốn chơi lại để xem nếu mình chọn khác thì chuyện sẽ đi tới đâu không?",
      ],
      choices: [{ id: "restart", label: "Chơi lại từ đầu (tìm ending khác)", next: "scene1" }],
    },
    endingNeutral: {
      id: "endingNeutral",
      kind: "ending",
      title: "NEUTRAL END",
      body: [
        "Minh rút ra được vài bài học, nhưng vẫn còn những khoảng mờ.",
        "Có lúc Minh đã thấy ‘không ổn’, nhưng lại chần chừ vì sợ mất cảm giác được quan tâm.",
        "Minh hiểu thêm về ranh giới — nhưng chưa đủ kiên định để bảo vệ nó trong mọi tình huống.",
        "Bài học ở đây là: nhận thức không tự nhiên biến thành hành động. Hành động cần luyện tập, cần người hỗ trợ, và cần dám chịu khó chịu trong ngắn hạn để an toàn dài hạn.",
        "",
        "Vẫn còn những ending khác. Bạn có muốn chơi lại để thử một hướng đi tỉnh táo hơn không?",
      ],
      choices: [{ id: "restart", label: "Chơi lại từ đầu", next: "scene1" }],
    },
    endingBad: {
      id: "endingBad",
      kind: "ending",
      title: "BAD END – BỊ CUỐN",
      body: [
        "Minh bị cuốn đi — không phải vì Minh yếu, mà vì Minh đã ở quá lâu trong một nhịp quan hệ khiến ‘bình thường’ bị bóp méo.",
        "Khi cảm xúc dâng cao và an toàn tụt xuống, quyết định thường không còn là lựa chọn tự do — mà là phản ứng để tránh sợ hãi, tránh mất mát.",
        "Hậu quả không chỉ là một sự kiện. Đó là những ngày mất ngủ, những câu hỏi tự trách, và cảm giác như mình đã đánh mất quyền làm chủ.",
        "Bài học đau nhất: nếu mình không bảo vệ ranh giới của mình, sẽ luôn có người (vô tình hoặc cố ý) đi qua nó.",
        "",
        "Nhưng câu chuyện chưa dừng ở đây. Bạn có thể chơi lại và thử đặt an toàn lên trước cảm xúc — để xem mọi thứ thay đổi ra sao.",
      ],
      choices: [{ id: "restart", label: "Chơi lại từ đầu (thử hướng an toàn hơn)", next: "scene1" }],
    },
    endingSecret: {
      id: "endingSecret",
      kind: "ending",
      title: "SECRET END – THOÁT SỚM",
      body: [
        "Minh nhận ra rất sớm rằng có điều gì đó không ổn.",
        "Không phải vì Minh ‘đa nghi’, mà vì Minh đủ tỉnh táo để tin vào cảm giác cảnh báo của chính mình — và đủ kiến thức để hiểu: tình yêu không thể là cái cớ để kiểm soát.",
        "Minh chọn rời đi khi vẫn còn giữ được sự an toàn, danh dự và tương lai của mình.",
        "Bài học của secret ending không phải là ‘chạy trốn’. Đó là năng lực đọc tín hiệu, dừng đúng lúc, và không tự thuyết phục bản thân rằng mình phải chịu đựng để được yêu.",
        "",
        "Vẫn còn những ending khác. Bạn muốn chơi lại để xem nếu mình ‘không nhận ra sớm’ thì câu chuyện sẽ khác thế nào không?",
      ],
      choices: [{ id: "restart", label: "Chơi lại từ đầu", next: "scene1" }],
    },
    endingBadEarly: {
      id: "endingBadEarly",
      kind: "ending",
      title: "BAD END SỚM",
      body: [
        "Mọi thứ diễn ra quá nhanh.",
        "Khi cảm xúc tăng vọt nhưng an toàn tụt xuống, Minh không còn đủ khoảng trống để suy nghĩ.",
        "Hậu quả đến sớm khiến Minh choáng váng: lo lắng, sợ hãi và tự trách.",
        "Bài học ở đây rất ngắn nhưng rất thật: an toàn không phải là ‘phần phụ’ của tình yêu — nó là nền móng.",
        "",
        "Bạn có muốn chơi lại từ đầu để thử giữ nhịp chậm hơn và đặt câu hỏi sớm hơn không?",
      ],
      choices: [{ id: "restart", label: "Chơi lại từ đầu", next: "scene1" }],
    },
  },

  quickEvents: [
    {
      id: "qe_night_habit",
      title: "QUICK EVENT – THÓI QUEN ĐÊM",
      body: ["Lan bắt đầu nhắn tin đêm thường xuyên."],
      lines: [
        { text: "Từ 0 giờ đến 2 giờ sáng, điện thoại Minh sáng liên tục." },
        { speakerId: "lan", text: "Ngủ chưa? Chị muốn nghe giọng em." },
        { speakerId: "minh", text: "(Mai mình kiểm tra… nhưng nếu không rep thì chị ấy giận.)" },
        { speakerId: "tuan", text: "Mày ngủ lúc mấy giờ vậy? Trông mệt dữ." },
        { speakerId: "minh", text: "(Nếu mình không chặn lại từ bây giờ, chuyện này sẽ thành bình thường.)" },
      ],
      when: {
        all: [
          { stat: { key: "E", op: ">=", value: 30 } },
          { stat: { key: "S", op: "<=", value: 35 } },
        ],
      },
      once: true,
      forced: false,
      choices: [
        {
          id: "qe1_a",
          label: "Nói chuyện mỗi đêm",
          effect: { stats: { E: 15, S: -10 }, flags: { red: 1 } },
          note: "🔴",
        },
        {
          id: "qe1_b",
          label: "Giới hạn thời gian",
          effect: { stats: { A: 10, S: 10 }, flags: { green: 1 } },
          note: "🟢",
        },
      ],
    },
    {
      id: "qe_boundaries",
      title: "QUICK EVENT – VƯỢT RANH GIỚI",
      body: ["Lan bắt đầu đẩy nhanh mức độ thân mật."],
      lines: [
        { text: "Lan liên tục đẩy câu chuyện sang hướng thân mật, nhanh hơn nhịp Minh sẵn sàng." },
        { speakerId: "lan", text: "Chị nghĩ em tin chị đủ rồi mà." },
        { speakerId: "minh", text: "Em cần chậm lại một chút." },
        { speakerId: "lan", text: "Chậm lại hay là em không thật lòng?" },
        { speakerId: "minh", text: "(Mình đang bị đặt vào thế phải chứng minh bằng cách từ bỏ ranh giới.)" },
      ],
      when: {
        all: [
          { stat: { key: "E", op: ">=", value: 50 } },
          { flag: { key: "red", op: ">=", value: 2 } },
        ],
      },
      once: true,
      forced: false,
      choices: [
        {
          id: "qe2_a",
          label: "Thuận theo",
          effect: { stats: { E: 20, S: -20 }, flags: { red: 1 } },
          note: "🔴",
        },
        {
          id: "qe2_b",
          label: "Thiết lập ranh giới",
          effect: { stats: { A: 15, S: 15 }, flags: { green: 1 } },
          note: "🟢",
        },
      ],
    },
    {
      id: "qe_isolation",
      title: "QUICK EVENT – CÔ LẬP",
      body: ["Lan khiến Minh xa dần bạn bè."],
      lines: [
        { text: "Nhóm chat lớp dần trôi xa Minh vì Minh luôn từ chối các cuộc hẹn." },
        { speakerId: "lan", text: "Bạn bè em chẳng hiểu em bằng chị đâu." },
        { speakerId: "huy", text: "Mày không cần biến mất chỉ để giữ một mối quan hệ." },
        { speakerId: "minh", text: "(Mình đang tự thu hẹp thế giới của mình vì sợ người khác giận.)" },
      ],
      when: {
        all: [
          { flag: { key: "red", op: ">=", value: 3 } },
          { stat: { key: "T", op: ">=", value: 40 } },
        ],
      },
      once: true,
      forced: false,
      choices: [
        {
          id: "qe3_a",
          label: "Chấp nhận",
          effect: { stats: { S: -15, R: -10 }, flags: { red: 1 } },
          note: "🔴",
        },
        {
          id: "qe3_b",
          label: "Nhận ra vấn đề",
          effect: { stats: { A: 20 }, unlockRoutes: ["aware"] },
          requires: { stat: { key: "A", op: ">=", value: 50 } },
          note: "🔒",
        },
      ],
    },
    {
      id: "qe_early_discovery",
      title: "QUICK EVENT – PHÁT HIỆN SỚM",
      body: ["Minh bắt đầu nhận ra sự thật trước khi quá muộn."],
      lines: [
        { text: "Lần đầu tiên, Minh nhìn mọi chuyện không qua lăng kính sợ mất, mà qua lăng kính tự bảo vệ." },
        { speakerId: "minh", text: "(Đây không phải tình yêu khiến mình lớn lên. Đây là thứ khiến mình thu nhỏ lại.)" },
      ],
      when: { stat: { key: "A", op: ">=", value: 70 } },
      once: true,
      forced: true,
      choices: [{ id: "qe4_ok", label: "Tiếp tục", effect: { stats: {} } }],
    },
  ],

  checks: [
    // BAD END sớm #1
    {
      id: "check_bad_early_1",
      when: {
        all: [
          { stat: { key: "S", op: "<=", value: 20 } },
          { stat: { key: "E", op: ">=", value: 70 } },
        ],
      },
      goto: "endingBadEarly",
    },
    // BAD END sớm #2
    {
      id: "check_bad_early_2",
      when: { flag: { key: "red", op: ">=", value: 5 } },
      goto: "endingBad",
    },

    // BAD END – BỊ CUỐN
    {
      id: "check_bad",
      when: {
        all: [
          {
            any: [
              { stat: { key: "S", op: "<=", value: 30 } },
              { stat: { key: "A", op: "<=", value: 30 } },
            ],
          },
          { stat: { key: "E", op: ">=", value: 75 } },
          { flag: { key: "red", op: ">=", value: 4 } },
        ],
      },
      goto: "endingBad",
    },

    // SECRET END – THOÁT SỚM
    {
      id: "check_secret",
      when: {
        all: [
          { stat: { key: "A", op: ">=", value: 80 } },
          { stat: { key: "S", op: ">=", value: 70 } },
          { seenQuickEvent: { id: "qe_early_discovery", is: true } },
        ],
      },
      goto: "endingSecret",
    },

    // GOOD END
    {
      id: "check_good",
      when: {
        all: [
          { stat: { key: "A", op: ">=", value: 75 } },
          { stat: { key: "S", op: ">=", value: 65 } },
          { route: { id: "aware", is: true } },
          { flag: { key: "green", op: ">=", value: 4 } },
        ],
      },
      goto: "endingGood",
    },

    // NEUTRAL END
    {
      id: "check_neutral",
      when: {
        all: [
          { stat: { key: "A", op: ">=", value: 50 } },
          { stat: { key: "S", op: ">=", value: 40 } },
        ],
      },
      goto: "endingNeutral",
    },
  ],
};

