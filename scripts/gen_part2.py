#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate Part 2 interview quiz questions (categories 6-10)."""
import json, os, random, importlib, sys

random.seed(42)
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src", "data")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "questions-p2.json")

_id = 0
def nid():
    global _id; _id += 1; return _id
def pick(a): return random.choice(a)
def pickn(a, n): return random.sample(a, min(n, len(a)))
def shuf(a): b = list(a); random.shuffle(b); return b
def mkc(cat, diff, q, correct, wrongs, exp):
    opts = shuf([correct] + wrongs[:3])
    return {"id": nid(), "cat": cat, "diff": diff, "type": "choice",
            "q": q, "opts": opts, "ans": opts.index(correct), "exp": exp}
def mktf(cat, diff, stmt, ok, exp):
    return {"id": nid(), "cat": cat, "diff": diff, "type": "truefalse",
            "q": stmt, "opts": ["正确", "错误"], "ans": 0 if ok else 1, "exp": exp}
def mkdiffs(total):
    e = int(total * 0.4); m = int(total * 0.4); h = total - e - m
    return shuf(["easy"]*e + ["medium"]*m + ["hard"]*h)

def gen_cat(cat, total, concepts, extra_choices, tf_true, tf_false):
    diffs = mkdiffs(total); qs = []; used = set(); idx = 0
    def add(q):
        nonlocal idx
        if idx >= total: return
        if q["q"] not in used:
            used.add(q["q"]); qs.append(q); idx += 1
    for c in concepts:
        if idx >= total: break
        n = c["name"]; desc = c["desc"]
        others = [x for x in concepts if x["name"] != n]
        od = [x["desc"] for x in pickn(others, 3)]
        for _ in range(6):
            if idx >= total: break
            d = diffs[idx]
            fld = c.get("field", "通用")
            tc = c.get("tc", ""); wc = c.get("wc", ""); sc = c.get("sc", ""); app = c.get("app", "")
            tmpl = pick([
                lambda: mkc(cat, d, f"以下关于{n}的描述，正确的是？", desc, od, f"{n}：{desc}。"),
                lambda: mkc(cat, d, f"{n}属于以下哪个领域？", fld,
                    pickn(list({x.get("field","通用") for x in others if x.get("field","通用")!=fld}) or [x.get("field","通用") for x in others], 3),
                    f"{n}属于{fld}领域。") if fld != "通用" else None,
                lambda: mkc(cat, d, f"{n}的时间复杂度是？", tc,
                    pickn(["O(1)","O(logn)","O(n)","O(nlogn)","O(n²)","O(n³)","O(2ⁿ)","O(V+E)","O(V²)","O(ElogV)"], 3),
                    f"{n}的时间复杂度为{tc}。") if tc else None,
                lambda: mkc(cat, d, f"{n}的最坏时间复杂度是？", wc,
                    pickn(["O(1)","O(logn)","O(n)","O(nlogn)","O(n²)","O(n³)"], 3),
                    f"{n}的最坏时间复杂度为{wc}。") if wc else None,
                lambda: mkc(cat, d, f"{n}的空间复杂度是？", sc,
                    pickn(["O(1)","O(logn)","O(n)","O(nlogn)","O(n²)","O(V²)"], 3),
                    f"{n}的空间复杂度为{sc}。") if sc else None,
                lambda: mkc(cat, d, f"{n}最适合解决以下哪类问题？", app, od,
                    f"{n}适合解决{app}的问题。") if app else None,
            ])
            r = tmpl()
            if r: add(r)
    for eq in extra_choices:
        if idx >= total: break
        add(mkc(cat, diffs[idx], eq[0], eq[1], eq[2], eq[3]))
    for item in tf_true:
        if idx >= total: break
        add(mktf(cat, diffs[idx], item[0], True, item[1]))
    for item in tf_false:
        if idx >= total: break
        add(mktf(cat, diffs[idx], item[0], False, item[1]))
    attempts = 0
    while idx < total and attempts < total * 10:
        attempts += 1; d = diffs[idx]; c = pick(concepts); n = c["name"]; desc = c["desc"]
        others = [x for x in concepts if x["name"] != n]
        tmpl = pick([
            lambda _n=n,_d=desc,_o=others: mkc(cat, d, f"以下关于{_n}的说法，正确的是？", _d,
                [x["desc"] for x in pickn(_o, 3)], f"{_n}：{_d}。"),
            lambda _n=n,_d=desc: mktf(cat, d, f"{_n}是计算机科学中的基础概念。", True, f"{_n}：{_d}。"),
            lambda _n=n,_d=desc: mktf(cat, d, f"{_n}只能在特定编程语言中使用。", False, f"{_n}是通用概念：{_d}。"),
            lambda _n=n,_d=desc,_o=others: mkc(cat, d, f"以下哪项不是{_n}的特点？",
                pick(_o)["desc"] if _o else "未知", [_d]+[x["desc"] for x in pickn(_o,2)],
                f"{_n}的实际特点是{_d}。"),
        ])
        add(tmpl())
    print(f"Generating {cat}: {len(qs)}/{total}")
    return qs

# Load knowledge bases from data files
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
sys.path.insert(0, DATA_DIR)

def load_module(name):
    spec = importlib.util.spec_from_file_location(name, os.path.join(DATA_DIR, name + ".py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

algo = load_module("algo_kb")
network = load_module("network_kb")
os_kb = load_module("os_kb")
database = load_module("database_kb")
python_kb = load_module("python_kb")

all_questions = []
all_questions.extend(gen_cat("algorithm", 720, algo.CONCEPTS, algo.EXTRA_CHOICES, algo.TF_TRUE, algo.TF_FALSE))
all_questions.extend(gen_cat("network", 520, network.CONCEPTS, network.EXTRA_CHOICES, network.TF_TRUE, network.TF_FALSE))
all_questions.extend(gen_cat("os", 420, os_kb.CONCEPTS, os_kb.EXTRA_CHOICES, os_kb.TF_TRUE, os_kb.TF_FALSE))
all_questions.extend(gen_cat("database", 420, database.CONCEPTS, database.EXTRA_CHOICES, database.TF_TRUE, database.TF_FALSE))
all_questions.extend(gen_cat("python", 520, python_kb.CONCEPTS, python_kb.EXTRA_CHOICES, python_kb.TF_TRUE, python_kb.TF_FALSE))

os.makedirs(OUTPUT_DIR, exist_ok=True)
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(all_questions, f, ensure_ascii=False, indent=2)
print(f"\nTotal questions generated: {len(all_questions)}")
print(f"Output file: {OUTPUT_FILE}")
