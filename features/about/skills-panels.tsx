"use client";

import { MotionConfig, motion } from "motion/react";
import type { SkillGroup } from "@/features/skills/types";

// The hexagon shape, drawn as 6 points (x% y%) around the box
const HEXAGON = "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)";

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const badge = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export default function SkillsPanels({ groups }: { groups: SkillGroup[] }) {
  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="skills-heading">
        <h3
          className="font-heading text-xl font-semibold tracking-tight"
          id="skills-heading">
          Skills
        </h3>

        <div className="mt-6 grid gap-4">
          {groups.map((group) => (
            <div
              key={group.category}
              className="rounded-xl border border-border bg-card/50 p-4">
              {/* Panel header */}
              <div className="mb-4 flex items-center justify-between font-mono text-xs">
                <h4 className="font-medium text-primary">
                  <span aria-hidden className="text-primary/50">
                    {"// "}
                  </span>
                  {group.category}
                </h4>
                <span aria-hidden className="text-muted-foreground">
                  [{String(group.items.length).padStart(2, "0")}]
                </span>
              </div>

              {/* Badges */}
              <motion.ul
                className="flex flex-wrap gap-x-2 gap-y-4"
                variants={list}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}>
                {group.items.map(({ id, name }) => (
                  <motion.li
                    key={id}
                    variants={badge}
                    className="group size-24 transition-[filter] hover:drop-shadow-[0_0_8px_var(--primary)]">
                    {/* Outer hexagon = the glowing rim */}
                    <div
                      style={{ clipPath: HEXAGON }}
                      className="size-full bg-linear-to-b from-primary/70 to-primary/10 p-0.5 transition-colors group-hover:from-primary group-hover:to-primary/40">
                      {/* Inner hexagon = the dark face, holding the name */}
                      <div
                        style={{ clipPath: HEXAGON }}
                        className="grid size-full place-items-center bg-card px-2 text-center">
                        <span className="font-mono text-[10px] font-semibold leading-tight text-primary/80 transition-colors group-hover:text-primary">
                          {name}
                        </span>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          ))}
        </div>
      </section>
    </MotionConfig>
  );
}
