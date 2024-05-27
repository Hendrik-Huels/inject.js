(async () => {
  const drawStatus = () => {
    const shadow = document.getElementById("pk-shadow").shadowRoot;
    const div = shadow.getElementById("pk-div");
    div.setAttribute("pk-name", "status");
    div.innerHTML = "";
  };

  const drawHunt = () => {
    const shadow = document.getElementById("pk-shadow").shadowRoot;
    const div = shadow.getElementById("pk-div");
    div.setAttribute("pk-name", "fight");
    div.innerHTML = `
        <div>
          <span style="font-size: 20px">Select Mob: </span>
          <select id="pk-df" style="font-size: 20px">
            <option value="${window.config.mob}" style="font-size: 20px">${window.config.mob}</option>
          </select>
          <button id="pk-update-mob" style="font-size: 20px">Update</button>
        </div>
      `;

    const selectMob = shadow.getElementById("pk-df");
    selectMob.onchange = () => {
      window.config.mob = selectMob.value;
    };
    shadow.getElementById("pk-update-mob").onclick = () => {
      x = [window.config.mob];
      if (cMain.document.hunt_map?.model?.objects_updater?.Objects) {
        Object.entries(
          cMain.document.hunt_map.model.objects_updater.Objects
        ).forEach(([_, value]) => {
          if (value.type === "bot") {
            if (!x.includes(value.name)) x.push(value.name);
          }
        });
      }
      selectMob.innerHTML = ``;
      x.forEach((value) => {
        selectMob.insertAdjacentHTML(
          "beforeend",
          `
          <option value="${value}" style="font-size: 20px">${value}</option>
          `
        );
      });
    };
  };

  const drawFight = () => {
    const shadow = document.getElementById("pk-shadow").shadowRoot;
    const div = shadow.getElementById("pk-div");
    div.setAttribute("pk-name", "fight");
    div.innerHTML = `
        <div style="display: flex flex-wrap: nowrap">
          <div>
          <span style="font-size: 20px">Select Fight mode: </span>
          <select id="pk-df" style="font-size: 20px">
            <option style="font-size: 20px" value="easy" ${
              window.config.fight.mode === "easy" ? "selected" : ""
            }>easy</option>
            <option style="font-size: 20px" value="RachNormal" ${
              window.config.fight.mode === "RachNormal" ? "selected" : ""
            }>RachNormal</option>
            <option style="font-size: 20px" value="RachFullBuffed" ${
              window.config.fight.mode === "RachFullBuffed" ? "selected" : ""
            }>RachFullBuffed</option>
            <option style="font-size: 20px" value="Schaiss" ${
              window.config.fight.mode === "Schaiss" ? "selected" : ""
            }>Schaiss</option>
          </select>
          </div>
          <div>
            <span style="font-size: 20px">Life elixir: </span>
            <input type="number" style="font-size: 20px" id="pk-fight-life" value="${
              window.config.fight.life
            }" />
          </div>
          <div>
            <span style="font-size: 20px">Mana elixir: </span>
            <input type="number" style="font-size: 20px" id="pk-fight-mana" value="${
              window.config.fight.mana
            }" />
          </div>
        </div>
      `;
    const selectFightType = shadow.getElementById("pk-df");
    selectFightType.onchange = () => {
      window.config.fight.mode = selectFightType.value;
    };
    shadow.getElementById("pk-fight-life").onchange = (event) => {
      if (event.target.value > 100 || event.target.value < 0) {
        event.target.value = window.config.fight.life;
        return;
      }
      window.config.fight.life = event.target.value;
    };
    shadow.getElementById("pk-fight-mana").onchange = (event) => {
      if (event.target.value > 100 || event.target.value < 0) {
        event.target.value = window.config.fight.mana;
        return;
      }
      window.config.fight.mana = event.target.value;
    };
  };

  const drawSettings = () => {
    const shadow = document.getElementById("pk-shadow").shadowRoot;
    const div = shadow.getElementById("pk-div");
    div.setAttribute("pk-name", "settings");
    div.innerHTML = `
    <div>
      <span style="font-size: 20px">Write logs: </span>
      <input id="pk-logs" type="checkbox" style="font-size: 20px; vertival-align: middle;" ${
        window.config.log ? "checked" : ""
      }>
    </div>
    <div>
      <span style="font-size: 20px">Use Effectsets: </span>
      <input id="pk-effecSet" type="checkbox" style="font-size: 20px; vertival-align: middle;" ${
        window.config.effectSet.enabled ? "checked" : ""
      }>
    </div>
    <div>
      <span style="font-size: 20px">Eating ID: </span>
      <input id="pk-eatingID" type="number" style="font-size: 20px;" value="${
        window.config.eating.id
      }">
    </div>
    `;

    shadow.getElementById("pk-logs").addEventListener("change", () => {
      window.config.log = !window.config.log;
    });
    shadow.getElementById("pk-effecSet").addEventListener("change", () => {
      window.config.effectSet.enabled = !window.config.effectSet.enabled;
    });
    shadow.getElementById("pk-eatingID").onchange = (event) => {
      window.config.eating.id = event.target.value;
    };
  };

  const removeWindow = () => {
    if (window.pkquit) {
      window.pkquit();
    }
  };

  const createWindow = () => {
    let offset = [0, 0];
    let isDown = false;

    let wrapper = document.createElement("div");
    wrapper.id = "pk-shadow";
    let shadow = wrapper.attachShadow({ mode: "open" });

    shadow.innerHTML = `
        <div id="pustekuchen" style="position: absolute; top: 0px; left: 0px; width: 550px; height: 400px; background: #2d2d2d; color: white; border: 2px solid #666; border-radius: 8px; z-index: 99999; overflow: hidden; user-select: none;">
            <button id="pk-update" style="font-size: 20px;margin: 8px; background: #444; color: white; border: 1px solid #666; cursor: pointer; border-radius: 4px;">Update</button>
            <button id="pk-mini" style="font-size: 20px; margin: 8px; background: #444; color: white; border: 1px solid #666; cursor: pointer; border-radius: 4px;">Minimize</button>
            <label for="pk-running" style="font-size: 20px; color: white;">Running: </label>
            <input id="pk-running" type="checkbox" style="font-size: 20px; vertival-align: middle;" ${
              window.config.running ? "checked" : ""
            }>
            <span style="font-size: 20px;">Version: ${version}</span>
            <div style="display: flex; flex-wrap: nowrap">
                <button id="pk-status" style="font-size: 20px; padding: 8px; margin: 8px; border: 1px solid #666; border-radius: 4px; background: #444; color: white; cursor: pointer">Status</button>
                <button id="pk-hunt" style="font-size: 20px; padding: 8px; margin: 8px; border: 1px solid #666; border-radius: 4px; background: #444; color: white; cursor: pointer">Hunt Settings</button>
                <button id="pk-fight" style="font-size: 20px; padding: 8px; margin: 8px; border: 1px solid #666; border-radius: 4px; background: #444; color: white; cursor: pointer">Fight Settings</button>
                <button id="pk-settings" style="font-size: 20px; padding: 8px; margin: 8px; border: 1px solid #666; border-radius: 4px; background: #444; color: white; cursor: pointer">Settings</button>
            </div>
            <div id="pk-div">

            </div>
        </div>
      `;

    document.body.appendChild(wrapper);

    shadow.getElementById("pk-running").addEventListener("change", () => {
      window.config.running = !window.config.running;
    });

    // Make window draggable
    const div = shadow.getElementById("pustekuchen");
    div.addEventListener(
      "mousedown",
      function (e) {
        isDown = true;
        offset = [div.offsetLeft - e.clientX, div.offsetTop - e.clientY];
      },
      true
    );

    const mUp = () => {
      isDown = false;
    };

    document.addEventListener("mouseup", mUp, true);

    const mM = (event) => {
      event.preventDefault();
      if (isDown) {
        const boundingRect = document.body.getBoundingClientRect();
        const maxX = boundingRect.width - div.offsetWidth;
        const maxY = boundingRect.height - div.offsetHeight;

        // Calculate new position within boundaries
        let newX = event.clientX + offset[0];
        let newY = event.clientY + offset[1];
        newX = Math.max(Math.min(newX, maxX), 0);
        newY = Math.max(Math.min(newY, maxY), 0);

        // Update element's position
        div.style.left = newX + "px";
        div.style.top = newY + "px";
      }
    };

    document.addEventListener("mousemove", mM, true);

    // Minimize Window
    shadow.getElementById("pk-mini").addEventListener("click", (event) => {
      if (div.style.height === "400px") {
        div.style.width = "220px";
        div.style.height = "45px";
        event.target.innerText = "Maximize";
      } else {
        div.style.width = "550px";
        div.style.height = "400px";
        event.target.innerText = "Minimize";
      }
    });

    window.pkquit = () => {
      document.removeEventListener("mouseup", mUp, true);
      document.removeEventListener("mousemove", mM, true);
      exit = true;
      document.getElementById("pk-shadow").remove();
    };

    // Update Window
    shadow.getElementById("pk-update").addEventListener("click", () => {
      window.pkquit();
      fetch(
        "https://raw.githubusercontent.com/Hendrik-Huels/inject.js/main/index.js",
        { cache: "no-store" }
      )
        .then((r) => r.text())
        .then((sC) => {
          eval(sC);
        });
    });

    shadow.getElementById("pk-status").addEventListener("click", () => {
      drawStatus();
    });
    shadow.getElementById("pk-hunt").addEventListener("click", () => {
      drawHunt();
    });
    shadow.getElementById("pk-fight").addEventListener("click", () => {
      drawFight();
    });
    shadow.getElementById("pk-settings").addEventListener("click", () => {
      drawSettings();
    });
  };

  const getStatus = () => {
    const items = () => {
      let hh_belt = {
        items: cMainFrame.document.items.model.items,
        cd: cMainFrame.document.items.model.groupCooldowns,
      };

      let hh_items = {
        Giant: { slot: [], cd: false },
        Spirit: { slot: [], cd: false },
        Life: { slot: [], cd: false },
        Mana: { slot: [], cd: false },
        Power: { slot: [], cd: false },
        Vampirism: { slot: [], cd: false },
        Blood: { slot: [], cd: false },
        Wisdom: { slot: [], cd: false },
        Atsha: { slot: [], cd: false },
        Rage: { slot: [], cd: false },
        ScrollOfChange: { slot: [], cd: false },
      };

      Object.entries(hh_belt.items).forEach(([_, o_value]) => {
        for (const [key, value] of Object.entries(elixirSets)) {
          if (value.includes(o_value?.image))
            hh_items[key].slot.push(o_value?.slot);
        }
        Object.entries(hh_belt.cd).forEach(([_, i_value]) => {
          if (o_value?.cdGroupId === i_value?.group) {
            for (const [key, value] of Object.entries(elixirSets)) {
              if (value.includes(o_value?.image)) hh_items[key].cd = true;
            }
          }
        });
      });
      return hh_items;
    };

    const getEffects = (enemy) => {
      let effects = {};
      const items =
        cMain.document?.game?.main?.view[enemy ? "effectsP2" : "effectsP1"]
          ?.items;
      if (items) {
        Object.entries(items).forEach(([_, items_value]) => {
          for (const [effect_key, effect_value] of Object.entries(effectSets)) {
            if (effect_value.includes(items_value?.data?.pic)) {
              effects[effect_key] = Math.floor(
                items_value.data.eetimeMax -
                  Date.now() / 1e3 -
                  (cMain.document.game.model.serverTimestamp -
                    cMain.document.game.model.clientTimestamp)
              );
            }
          }
        });
      }
      return effects;
    };

    const hpCur = () => {
      if (cMain.document?.game?.model?.persHp) {
        return cMain.document?.game?.model?.persHp;
      }
      return cMainFrame.document.lvl.model.hpCur;
    };

    const hpMax = () => {
      if (cMain.document?.game?.model?.persHpMax) {
        return cMain.document?.game?.model?.persHpMax;
      }
      return cMainFrame.document.lvl.model.hpMax;
    };

    const mpCur = () => {
      if (cMain.document?.game?.model?.persMp) {
        return cMain.document?.game?.model?.persMp;
      }
      return cMainFrame.document.lvl.model.mpCur;
    };

    const mpMax = () => {
      if (cMain.document?.game?.model?.persMpMax) {
        return cMain.document?.game?.model?.persMpMax;
      }
      return cMainFrame.document.lvl.model.mpMax;
    };

    const cwindow = () => {
      let backpack = cMainFrame.document
        .getElementById("backpack")
        ?.getAttribute("class");
      if (backpack && !backpack.includes("hide-trick")) {
        return "backpack";
      }
      let pname = cMain.document.location.pathname;
      switch (pname) {
        case "/area.php":
          return "location";
        case "/hunt.php":
          return "hunt";
        case "/fight.php":
          return "fight";
        case "/blank.html":
          return "loading";
        default:
          return "unknown";
      }
    };

    const fight = () => {
      return {
        totalDamage: cMain?.document?.game?.model?.totalDamage,
        block:
          cMain?.document?.game?.main?.view?.centerView?.cAttack?.blockOn
            ?.visible,
        combo: {
          step: cMain.document?.game?.main?.children[0]?.comboView?.comboStep,
          combo:
            cMain.document?.game?.main?.children[0]?.comboView?.activeCombo
              ?.seq,
        },
        result: cMain.document?.game?.model?.fightResult,
        running: cMain.document?.game?.model?.fightRunning,
        myTurn: cMain.document?.game?.main?.view?.centerView?.visible,
        mode: cMain.document?.game?.main?.view?.centerView?._mode,
        aura: cMain.document?.game?.model?.currentAura ? true : false,
        bowEnergie: cMain.document?.game?.model?.bowEnergyValue,
        enemyEffects: getEffects(true),
        myEffects: getEffects(false),
        mode: cMain.document?.game?.main?.view?.centerView?._mode,
        opponentIsThere: cMain.document?.game?.main?.view?.oppNick.nick ? true : false,
      };
    };

    const mobs = () => {
      let x = [];
      if (cMain.document.hunt_map?.model?.objects_updater?.Objects) {
        Object.entries(
          cMain.document.hunt_map.model.objects_updater.Objects
        ).forEach(([key, value]) => {
          if (value.type === "bot") {
            x.push({
              id: value.id,
              name: value.name,
              fight_id: value.fight_id,
            });
          }
        });
      }
      return x;
    };

    return {
      items: items(),
      hpCur: hpCur(),
      hpMax: hpMax(),
      mpCur: mpCur(),
      mpMax: mpMax(),
      window: cwindow(),
      fight: fight(),
      mobs: mobs(),
    };
  };

  const eat = () => {
    if (window.config.eating.enabled && window.config.eating.id) {
      executionTimes = window.config.eating.history.filter(
        (timestamp) => Date.now() - timestamp < 10000
      );
      if (
        executionTimes.length !== 2 ||
        window.config.eating.history.length < 2
      ) {
        showMsg(
          `action_form.php?${Math.random()}&in[param_success][url_close]=1&artifact_id=${
            window.config.eating.id
          }&in[external]=1&in[noconfirm]=1`,
          "Verwenden"
        );
        window.config.eating.history.push(Date.now());
        window.config.eating.history = window.config.eating.history.splice(-2);
      }
    }
  };

  const changeModeToAttack = () => {
    cMainFrame.document.body.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Tab",
        keyCode: 9,
        bubbles: !0,
        cancelBubbles: !1,
        which: 9,
        code: "Tab",
        location: 0,
        altKey: !1,
        ctrlKey: !1,
        metaKey: !1,
        shiftKey: !1,
        repeat: !1,
      })
    );
  };

  const spell = (key) => {
    cMainFrame.document.body.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "d",
        keyCode: 68,
        bubbles: !0,
        cancelBubbles: !1,
        which: 68,
        code: "KeyD",
        location: 0,
        altKey: !1,
        ctrlKey: !1,
        metaKey: !1,
        shiftKey: !1,
        repeat: !1,
      })
    );
  };

  const attack = (slot) => {
    switch (slot) {
      case 1:
        cMainFrame.document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "ArrowUp",
            keyCode: 38,
            bubbles: !0,
            cancelBubbles: !1,
            which: 38,
            code: "ArrowUp",
            location: 0,
            altKey: !1,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !1,
            repeat: !1,
          })
        );
        break;
      case 2:
        cMainFrame.document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "ArrowRight",
            keyCode: 39,
            bubbles: !0,
            cancelBubbles: !1,
            which: 39,
            code: "ArrowRight",
            location: 0,
            altKey: !1,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !1,
            repeat: !1,
          })
        );
        break;
      case 3:
        cMainFrame.document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "ArrowDown",
            keyCode: 40,
            bubbles: !0,
            cancelBubbles: !1,
            which: 40,
            code: "ArrowDown",
            location: 0,
            altKey: !1,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !1,
            repeat: !1,
          })
        );
        break;
    }
  };

  const bow = (slot) => {
    switch (slot) {
      case "k":
        window._top().frames.main_frame.document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "k",
            keyCode: 75,
            bubbles: !0,
            cancelBubbles: !1,
            which: 75,
            code: "KeyK",
            location: 0,
            altKey: !1,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !1,
            repeat: !1,
          })
        );
        break;
    }
  };

  const toggleBlock = () => {
    window
      ._top()
      .frames.main_frame.frames.main.canvas.EventManager.dispatchEvent(
        canvas.app.battle.Event.BLOCK_SWITCH
      );
  };

  const activateAura = (slot) => {
    switch (slot) {
      case "t":
        window._top().frames.main_frame.document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "t",
            keyCode: 84,
            bubbles: !0,
            cancelBubbles: !1,
            which: 84,
            code: "KeyT",
            location: 0,
            altKey: !1,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !1,
            repeat: !1,
          })
        );
        break;
    }
  };

  const usePotion = (slot) => {
    switch (slot) {
      case 1:
        window._top().frames.main_frame.document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "1",
            keyCode: 49,
            bubbles: !0,
            cancelBubbles: !1,
            which: 49,
            code: "Digit1",
            location: 0,
            altKey: !1,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !1,
            repeat: !1,
          })
        );
        break;
      case 2:
        window._top().frames.main_frame.document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "2",
            keyCode: 50,
            bubbles: !0,
            cancelBubbles: !1,
            which: 50,
            code: "Digit2",
            location: 0,
            altKey: !1,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !1,
            repeat: !1,
          })
        );
        break;
      case 3:
        window._top().frames.main_frame.document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "3",
            keyCode: 51,
            bubbles: !0,
            cancelBubbles: !1,
            which: 51,
            code: "Digit3",
            location: 0,
            altKey: !1,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !1,
            repeat: !1,
          })
        );
        break;
      case 4:
        window._top().frames.main_frame.document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "4",
            keyCode: 52,
            bubbles: !0,
            cancelBubbles: !1,
            which: 52,
            code: "Digit4",
            location: 0,
            altKey: !1,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !1,
            repeat: !1,
          })
        );
        break;
      case 5:
        window._top().frames.main_frame.document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "5",
            keyCode: 53,
            bubbles: !0,
            cancelBubbles: !1,
            which: 53,
            code: "Digit5",
            location: 0,
            altKey: !1,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !1,
            repeat: !1,
          })
        );
        break;
      case 6:
        window._top().frames.main_frame.document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "6",
            keyCode: 54,
            bubbles: !0,
            cancelBubbles: !1,
            which: 54,
            code: "Digit6",
            location: 0,
            altKey: !1,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !1,
            repeat: !1,
          })
        );
        break;
      case 7:
        window._top().frames.main_frame.document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "7",
            keyCode: 55,
            bubbles: !0,
            cancelBubbles: !1,
            which: 55,
            code: "Digit7",
            location: 0,
            altKey: !1,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !1,
            repeat: !1,
          })
        );
        break;
      case 8:
        window._top().frames.main_frame.document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "8",
            keyCode: 56,
            bubbles: !0,
            cancelBubbles: !1,
            which: 56,
            code: "Digit8",
            location: 0,
            altKey: !1,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !1,
            repeat: !1,
          })
        );
        break;
      case 9:
        window._top().frames.main_frame.document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "9",
            keyCode: 57,
            bubbles: !0,
            cancelBubbles: !1,
            which: 57,
            code: "Digit9",
            location: 0,
            altKey: !1,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !1,
            repeat: !1,
          })
        );
        break;
      case 10:
        window._top().frames.main_frame.document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "0",
            keyCode: 48,
            bubbles: !0,
            cancelBubbles: !1,
            which: 48,
            code: "Digit0",
            location: 0,
            altKey: !1,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !1,
            repeat: !1,
          })
        );
        break;
      case 11:
        window._top().frames.main_frame.document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "-",
            keyCode: 189,
            bubbles: !0,
            cancelBubbles: !1,
            which: 189,
            code: "Slash",
            location: 0,
            altKey: !1,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !1,
            repeat: !1,
          })
        );
        break;
      case 12:
        window._top().frames.main_frame.document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "=",
            keyCode: 48,
            bubbles: !0,
            cancelBubbles: !1,
            which: 48,
            code: "Digit0",
            location: 0,
            altKey: !1,
            ctrlKey: !1,
            metaKey: !1,
            shiftKey: !0,
            repeat: !1,
          })
        );
        break;
    }
  };

  const fightEasy = () => {
    if (!stat.fight.aura && stat.mpCur > 140) {
      activateAura("t");
    }
    if (stat.fight.aura && stat.mpCur >= 70 && stat.hpCur >= 550) {
      attack(Number(stat.fight.combo.combo[stat.fight.combo.step]));
    }
    if (
      (stat.mpCur < 70 && stat.items.Mana.slot.length === 0) ||
      (stat.hpCur < 550 && stat.items.Life.slot.length === 0)
    ) {
      attack(Number(stat.fight.combo.combo[stat.fight.combo.step]));
    }
  };

  const fightRach = () => {
    if (
      !stat.fight.aura &&
      stat.mpCur > 140 &&
      !(window.config.fight.turn === 3) &&
      stat.fight.mode === "attack"
    ) {
      activateAura("t");
    }
    switch (window.config.fight.turn) {
      case 1:
        if (
          stat.fight.mode === "spells" &&
          !("absoluteUnverwundbarkeit" in stat.fight.myEffects)
        ) {
          spell("d");
        }
        if (
          stat.fight.mode === "spells" &&
          "absoluteUnverwundbarkeit" in stat.fight.myEffects
        ) {
          changeModeToAttack();
        }
        if (
          !("bow_crit" in stat.fight.enemyEffects) &&
          stat.fight.bowEnergie >= 72
        ) {
          bow("k");
        }

        if (!("elixir_power" in stat.fight.myEffects)) {
          usePotion(stat.items.Power.slot[0]);
        }

        if (
          stat.fight.aura &&
          "bow_crit" in stat.fight.enemyEffects &&
          "elixir_power" in stat.fight.myEffects &&
          stat.hpCur > 800 &&
          stat.mpCur > 69 &&
          stat.fight.mode === "attack"
        ) {
          attack(Number(stat.fight.combo.combo[stat.fight.combo.step]));
        }
        break;
      case 2:
        if (!("elixir_power" in stat.fight.myEffects)) {
          usePotion(stat.items.Power.slot[0]);
        }
        if (
          stat.fight.aura &&
          "elixir_power" in stat.fight.myEffects &&
          stat.hpCur > 800 &&
          stat.mpCur > 69
        ) {
          attack(Number(stat.fight.combo.combo[stat.fight.combo.step]));
        }
        break;
      case 3:
        if (!stat.fight.block) {
          toggleBlock();
        }
        if (stat.fight.block && stat.hpCur > 800) {
          attack(Number(stat.fight.combo.combo[stat.fight.combo.step]));
        }
        break;
      case 4:
        if (stat.fight.block) {
          toggleBlock();
        }
        if (!("elixir_power" in stat.fight.myEffects)) {
          usePotion(stat.items.Power.slot[0]);
        }
        if (
          stat.fight.aura &&
          !stat.fight.block &&
          "elixir_power" in stat.fight.myEffects &&
          stat.hpCur > 800 &&
          stat.mpCur > 69
        ) {
          attack(Number(stat.fight.combo.combo[stat.fight.combo.step]));
        }
        break;
      case 5:
        if (!("elixir_power" in stat.fight.myEffects)) {
          usePotion(stat.items.Power.slot[0]);
        }
        if (stat.fight.aura && "elixir_power" in stat.fight.myEffects) {
          attack(Number(stat.fight.combo.combo[stat.fight.combo.step]));
        }
        break;
      default:
        if (stat.fight.mode === "spells") {
          changeModeToAttack();
        }
        if ("racheDesRachdarischenZenturios" in stat.fight.myEffects) {
          if (!stat.fight.block) {
            toggleBlock();
          } else if (stat.hpCur > 600) {
            attack(Number(stat.fight.combo.combo[stat.fight.combo.step]));
          }
        } else {
          if (stat.fight.block) {
            toggleBlock();
          } else {
            if (stat.hpCur > 800 && stat.mpCur > 69 && stat.fight.aura) {
              attack(Number(stat.fight.combo.combo[stat.fight.combo.step]));
            }
          }
        }
        break;
    }
  };

  const fightSchaiss = () => {
    if (!stat.fight.aura && stat.mpCur > 140) {
      activateAura("t");
    }
    if (stat.fight.totalDamage < 65000) {
      if (
        stat.fight.aura &&
        stat.mpCur > 70 &&
        stat.hpCur > 800 &&
        "ShaissarFilthFog" in stat.fight.enemyEffects &&
        stat.fight.enemyEffects.ShaissarFilthFog > 6
      ) {
        attack(Number(stat.fight.combo.combo[stat.fight.combo.step]));
      }
    } else {
      if (
        ("ShaissarFilthFog" in stat.fight.enemyEffects &&
          stat.fight.enemyEffects.ShaissarFilthFog < 2) ||
        !("ShaissarFilthFog" in stat.fight.enemyEffects)
      ) {
        attack(Number(stat.fight.combo.combo[stat.fight.combo.step]));
      }
    }
  };

  const cHunt = (stat) => {
    if (!stat.mobs) {
      return;
    }
    if (window.config.effectSet.enabled && window.config.effectSet.onTheWay) {
      cMainFrame.processMenu("b02");
      return;
    }
    if (
      getComputedStyle(document.getElementById("systemConfirm_div")).display ==
      "block"
    ) {
      document.getElementById("btnCancel").click();
    }
    if (frames.error.document.getElementsByTagName("input").length > 0) {
      frames.error.document.getElementsByTagName("input")[0].click();
    }
    if (stat.hpCur === stat.hpMax && stat.mpCur === stat.mpMax) {
      for (const mob of stat.mobs) {
        if (
          mob.name === window.config.mob &&
          mob.fight_id !== 0 &&
          !window.config.fight.triedAttack.includes(mob.id)
        ) {
          cMain.huntAttack(mob.id, false);
          window.config.fight.turn = 1;
          window.config.fight.lastComboStep = 0;
          window.config.fight.triedAttack.push(mob.id);
          return;
        }
      }
    } else {
      eat();
    }
  };

  const cFight = (stat) => {
    if (!stat.fight.running) {
      return;
    }
    window.config.fight.triedAttack = [];
    if (window.config.fight.lastComboStep !== stat.fight.combo.step) {
      window.config.fight.turn = window.config.fight.turn + 1;
      window.config.fight.lastComboStep = stat.fight.combo.step;
    }
    switch (stat.fight.result) {
      case 2:
        cMainFrame.processMenu("b06");
        break;
      case 1:
        eat();
        eat();
        cMainFrame.processMenu("b07");
      case 0:
        if (stat.items.Giant.slot.length > 0) {
          usePotion(stat.items.Giant.slot[0]);
        }
        if (stat.mpMax != 0 && stat.items.Spirit.slot.length > 0) {
          usePotion(stat.items.Spirit.slot[0]);
        }
        if (
          stat.hpCur / stat.hpMax < window.config.fight.life / 100 &&
          stat.items.Life.cd == false &&
          stat.items.Life.slot.length > 0
        ) {
          usePotion(stat.items.Life.slot[0]);
        }
        if (
          stat.mpMax != 0 &&
          stat.mpCur / stat.mpMax < window.config.fight.mana / 100 &&
          stat.items.Mana.cd == false &&
          stat.items.Mana.slot.length > 0
        ) {
          usePotion(stat.items.Mana.slot[0]);
        }

        // Custom debuff removals
        if ("ShaissarDebuff" in stat.fight.myEffects && !("ScrollOfChange" in stat.fight.myEffects)){
          usePotion(stat.items.ScrollOfChange.slot[0]);                                
        }

        if (stat.fight.myTurn && stat.fight.opponentIsThere) {
          switch (window.config.fight.mode) {
            case "easy":
              fightEasy();
              break;
            case "RachNormal":
              window.config.fight.turn = 10;
              fightRach();
              break;
            case "RachFullBuffed":
              fightRach();
              break;
            case "Schaiss":
              fightSchaiss();
              break;
          }
        }
    }
  };

  const navigateBackpack = async () => {
    const tab =
      cMainFrame.frames.backpack.document.getElementsByClassName(
        "menu-effects_set"
      );
    if (
      tab.length === 1 &&
      `${window.location.origin}/user.php?mode=effects_set` !==
        cMainFrame.frames.backpack.location.href &&
      window.config.effectSet.enabled
    ) {
      tab[0].click();
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    const inputElement = cMainFrame.frames.backpack.document.querySelector(
      'input[value="Verwenden"]'
    );
    if (inputElement && window.config.effectSet.enabled) {
      inputElement.click();
      window.config.onTheWay = false;
      cMainFrame.processMenu("b07");
    }
  };

  let version = "0.0.1";
  let exit = false;

  const cMain = frames.main_frame.frames.main;
  const cMainFrame = frames.main_frame;

  const elixirSets = {
    Giant: [
      "maxhp3-purp.gif", // Purple: Machtvolles Elixier des Giganten, Geschenk-Elixier des Giganten
    ],
    Spirit: [
      "flask_duh_20071207_03.gif", // Blue: großes Elixier des Geistes
    ],
    Life: [
      "life3-purple.gif", // Purple: Machtvolles Lebenselixier
    ],
    Mana: [
      "flask_mana_20071207_03.gif", // Blue Großes Manaelixier, Geschenk-Mana-Elixier
    ],
    Power: [
      "161532_101_4.gif", // Purple: Mächtiges Machtextrakt
      "161512_99_1.gif", // Green: Machtextrakt
    ],
    Vampirism: [
      "155159_89_1.gif", // Green: Vampirismusextrakt
    ],
    Blood: [
      "161438_94_1.gif", // Green Blutextrakt
    ],
    Wisdom: [
      "elik_mudrost4_2508.gif", // Purple Machtvolles Weisheitselixier
    ],
    Atsha: [
      "crit_atshi4_250811.gif", // Purple Machtvolles Atscha-Elixier
    ],
    Rage: [
      "e_tima_gnev.gif", // Dunkles Zornelixier
    ],
    ScrollOfChange: [
      "filth_mag_switch_01_gray.gif" // Gray
    ]
  };

  const effectSets = {
    bow_crit: [
      `${window.location.origin}/images/data/artifacts/krit_bow_purp.gif`, // Purble Bow
      `${window.location.origin}/images/data/artifacts/krit_bow_red.gif`, // Red Bow
    ],
    zauberschein: [
      `${window.location.origin}/images/data/artifacts/eldkrof_buff_eff.gif`, // Red Buff
    ],
    elixir_power: [
      `${window.location.origin}/images/data/artifacts/10199_dikaja_otvaga.gif`, // Begleiter Power
      `${window.location.origin}/images/data/artifacts/161512_99_1.gif`, // Green Power
      `${window.location.origin}/images/data/artifacts/161532_101_4.gif`, // Purple Power
    ],
    racheDesRachdarischenZenturios: [
      `${window.location.origin}/images/data/artifacts/ab_kon_3.gif`,
    ],
    absoluteUnverwundbarkeit: [
      `${window.location.origin}/images/data/artifacts/absshield_all_3.gif`,
    ],
    ShaissarDebuff: [
      `${window.location.origin}/images/data/artifacts/zbers_baf3.gif`,
    ],
    ShaissarFilthFog: [
      `${window.location.origin}/images/data/artifacts/56795_debaff.gif`,
    ],
    ScrollOfChange: [
      `${window.location.origin}/images/data/artifacts/filth_mag_switch_01_gray.gif` // Gray
    ]
  };

  if (!window.config) {
    window.config = {
      mob: "Rachdarischer Zenturio",
      eating: {
        id: "",
        enabled: true,
        history: [],
      },
      effectSet: {
        enabled: false,
        onTheWay: false,
      },
      sleep: 100,
      fight: {
        life: 85,
        mana: 99,
        aura: true,
        mode: "easy",
        turn: 1,
        lastComboStep: 0,
        triedAttack: [],
      },
      log: false,
      running: false,
    };
  }

  let stat = getStatus();

  removeWindow();
  createWindow();

  while (!exit) {
    stat = getStatus();
    if (window.config.log) console.log(stat);
    if (window.config.running) {
      switch (stat.window) {
        case "backpack":
          await navigateBackpack();
          break;
        case "location":
          if (stat.hpCur === 0) {
            resurrect(1);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            eat();
            eat();
          } else {
            cMainFrame.processMenu("b07");
          }
          break;
        case "hunt":
          cHunt(stat);
          break;
        case "fight":
          cFight(stat);
          break;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, window.config.sleep));
  }
})();
