import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import DepartureBoard from "../DepartureBoard.vue";

describe("DepartureBoard", () => {
  it("shows empty state when there are no departures", () => {
    const wrapper = mount(DepartureBoard, {
      props: {
        departures: [],
      },
      global: {
        directives: {
          "delay-highlight": {},
        },
      },
    });

    expect(wrapper.text()).toContain("Brak danych o odjazdach");
  });

  it("renders departure data", () => {
    const wrapper = mount(DepartureBoard, {
      props: {
        departures: [
          {
            id: "test-1",
            routeId: 9,
            headsign: "Strzyża PKM",
            estimatedTime: "2026-05-14T20:39:34Z",
            theoreticalTime: "2026-05-14T20:42:00Z",
            delayInSeconds: -145,
            status: "REALTIME",
            timestamp: "20:30",
          },
        ],
      },
      global: {
        directives: {
          "delay-highlight": {},
        },
      },
    });

    expect(wrapper.text()).toContain("9");
    expect(wrapper.text()).toContain("Strzyża PKM");
    expect(wrapper.text()).toContain("przed czasem");
  });
});
