import {
  Badge,
  Button,
  Card,
  ColorPicker,
  Input,
  parseColor,
  Progress,
  Separator,
  Slider,
  Switch,
  Textarea,
  useCopyToClipboard,
} from "@almach/ui";
import { cn } from "@almach/utils";
import { Check, Copy, Dices, Play, RotateCcw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { ThemeModeToggle } from "../ThemeModeToggle";
import {
  CURATED_COLOR_PRESETS,
  CURATED_SURFACE_PRESETS,
  EASING_PRESETS,
  getColorPresetByName,
  hslTripleToCss,
  MOTION_PRESETS,
  RADIUS_PRESETS,
  THEME_PACKS,
  type ThemeJSONPayload,
} from "./presets";
import {
  ChoiceList,
  PopoverLabel,
  SettingGroup,
  SettingRow,
} from "./setting-row";
import { useThemeState } from "./use-theme-state";

export function ThemeCustomizer() {
  const theme = useThemeState();
  const { selection } = theme;

  const css = useCopyToClipboard();
  const json = useCopyToClipboard();

  const [seed, setSeed] = useState("");
  const [jsonDraft, setJsonDraft] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  // Bumped to restart the preview animation so the easing is perceptible.
  const [replay, setReplay] = useState(0);

  const accent =
    selection.customAccent ?? getColorPresetByName(selection.preset);
  const accentCss = useMemo(() => hslTripleToCss(accent.light), [accent.light]);
  const accentColor = useMemo(() => {
    try {
      return parseColor(accentCss);
    } catch {
      return parseColor("hsl(0, 0%, 0%)");
    }
  }, [accentCss]);

  const activePack = THEME_PACKS.find(
    (pack) =>
      !selection.customAccent &&
      pack.color === selection.preset &&
      pack.surface === selection.surface &&
      pack.radius === selection.radius,
  );

  const activeMotion = MOTION_PRESETS.find(
    (preset) =>
      preset.overlayMs === selection.overlayMs &&
      preset.interactiveMs === selection.interactiveMs,
  );

  const activeRadius = RADIUS_PRESETS.find(
    (preset) => preset.value === selection.radius,
  );

  const activeEase = EASING_PRESETS.find(
    (preset) => preset.value === selection.ease,
  );

  const applyJson = useCallback(() => {
    try {
      theme.fromJSON(JSON.parse(jsonDraft) as ThemeJSONPayload);
      setJsonError(null);
    } catch {
      setJsonError("Not valid JSON. Paste a theme payload and retry.");
    }
  }, [jsonDraft, theme]);

  const swatchDot = (color: string) => (
    <span
      aria-hidden="true"
      className="block size-4 rounded-full border border-border"
      style={{ background: color }}
    />
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
      {/* Control rail — one row per setting, each opening its choices. */}
      <Card className="overflow-hidden lg:sticky lg:top-24">
        <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2.5">
          <span className="text-sm font-semibold">Theme</span>
          <ThemeModeToggle />
        </div>

        <SettingGroup>
          <SettingRow
            label="Preset"
            value={activePack?.name ?? "Custom"}
            affordance={swatchDot(accent.swatch)}
            width="w-72"
          >
            {(close) => (
              <ChoiceList
                options={THEME_PACKS.map((pack) => ({
                  id: pack.name,
                  label: pack.name,
                  hint: pack.note ?? `${pack.color} · ${pack.surface}`,
                  swatch: getColorPresetByName(pack.color).swatch,
                }))}
                selected={activePack?.name ?? null}
                onSelect={(name) => {
                  const pack = THEME_PACKS.find((entry) => entry.name === name);
                  if (pack) theme.applyPack(pack);
                  close();
                }}
              />
            )}
          </SettingRow>

          <SettingRow
            label="Accent"
            value={selection.customAccent ? "Custom" : accent.name}
            affordance={swatchDot(accent.swatch)}
            width="w-64"
          >
            {(close) => (
              <div className="flex flex-col gap-3">
                <div>
                  <PopoverLabel>Presets</PopoverLabel>
                  <div className="grid grid-cols-6 gap-1.5 px-1">
                    {CURATED_COLOR_PRESETS.map((preset) => {
                      const isActive =
                        !selection.customAccent &&
                        selection.preset === preset.name;

                      return (
                        <button
                          key={preset.name}
                          type="button"
                          title={preset.name}
                          aria-label={preset.name}
                          aria-pressed={isActive}
                          onClick={() => {
                            theme.update({ preset: preset.name });
                            close();
                          }}
                          className={cn(
                            "flex size-7 cursor-pointer items-center justify-center rounded-full border transition-transform",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                            isActive
                              ? "border-foreground/40"
                              : "border-border hover:scale-105",
                          )}
                          style={{ background: preset.swatch }}
                        >
                          {isActive && (
                            <Check
                              className="size-3.5 text-background"
                              strokeWidth={3}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                <div>
                  <PopoverLabel>Custom</PopoverLabel>
                  {/* Picking here derives the dark-mode pair from the chosen
                      colour, so both modes stay legible. */}
                  <ColorPicker
                    value={accentColor}
                    onChange={(next) =>
                      theme.setCustomAccent(next.toString("hsl"))
                    }
                    className="gap-2"
                  >
                    <ColorPicker.Area
                      colorSpace="hsb"
                      xChannel="saturation"
                      yChannel="brightness"
                      className="h-24"
                    />
                    <ColorPicker.Slider channel="hue" colorSpace="hsb" />
                    <ColorPicker.Field size="sm" />
                  </ColorPicker>
                </div>
              </div>
            )}
          </SettingRow>

          <SettingRow
            label="Surface"
            value={selection.surface}
            affordance={
              <span
                aria-hidden="true"
                className="block size-4 rounded-sm border border-border bg-card"
              />
            }
          >
            {(close) => (
              <ChoiceList
                options={CURATED_SURFACE_PRESETS.map((surface) => ({
                  id: surface.name,
                  label: surface.name,
                }))}
                selected={selection.surface}
                onSelect={(surface) => {
                  theme.update({ surface });
                  close();
                }}
              />
            )}
          </SettingRow>
        </SettingGroup>

        <Separator />

        <SettingGroup>
          <SettingRow
            label="Radius"
            value={activeRadius?.name ?? selection.radius}
            affordance={
              <span
                aria-hidden="true"
                className="block size-4 border-2 border-foreground/40"
                style={{ borderRadius: selection.radius }}
              />
            }
          >
            {(close) => (
              <ChoiceList
                options={RADIUS_PRESETS.map((preset) => ({
                  id: preset.value,
                  label: preset.name,
                  hint: preset.value,
                }))}
                selected={selection.radius}
                onSelect={(radius) => {
                  theme.update({ radius });
                  close();
                }}
              />
            )}
          </SettingRow>

          <SettingRow
            label="Motion"
            value={activeMotion?.name ?? "Custom"}
            affordance={
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {selection.overlayMs}/{selection.interactiveMs}ms
              </span>
            }
            width="w-72"
          >
            {() => (
              <div className="flex flex-col gap-3">
                <div>
                  <PopoverLabel>Speed</PopoverLabel>
                  <ChoiceList
                    options={MOTION_PRESETS.map((preset) => ({
                      id: preset.name,
                      label: preset.name,
                      hint: `${preset.overlayMs}ms · ${preset.interactiveMs}ms`,
                    }))}
                    selected={activeMotion?.name ?? null}
                    onSelect={(name) => {
                      const preset = MOTION_PRESETS.find(
                        (entry) => entry.name === name,
                      );
                      if (preset) {
                        theme.update({
                          overlayMs: preset.overlayMs,
                          interactiveMs: preset.interactiveMs,
                        });
                      }
                    }}
                  />
                </div>

                <Separator />

                <div className="flex flex-col gap-4 px-1">
                  <Slider
                    label="Overlay"
                    size="sm"
                    showValue
                    minValue={0}
                    maxValue={500}
                    step={10}
                    value={selection.overlayMs}
                    onChange={(value) =>
                      typeof value === "number" &&
                      theme.update({ overlayMs: value })
                    }
                    formatOptions={{
                      style: "unit",
                      unit: "millisecond",
                      unitDisplay: "narrow",
                    }}
                  />
                  <Slider
                    label="Interactive"
                    size="sm"
                    showValue
                    minValue={0}
                    maxValue={400}
                    step={10}
                    value={selection.interactiveMs}
                    onChange={(value) =>
                      typeof value === "number" &&
                      theme.update({ interactiveMs: value })
                    }
                    formatOptions={{
                      style: "unit",
                      unit: "millisecond",
                      unitDisplay: "narrow",
                    }}
                  />
                </div>

                <Separator />

                <div>
                  <PopoverLabel>Easing</PopoverLabel>
                  <ChoiceList
                    options={EASING_PRESETS.map((preset) => ({
                      id: preset.value,
                      label: preset.name,
                    }))}
                    selected={selection.ease}
                    onSelect={(ease) => theme.update({ ease })}
                  />
                </div>
              </div>
            )}
          </SettingRow>

          <SettingRow
            label="Import"
            value="Seed or JSON"
            affordance={
              <span className="text-[11px] text-muted-foreground">Paste</span>
            }
            width="w-80"
          >
            {() => (
              <div className="flex flex-col gap-3 p-1">
                <div className="flex flex-col gap-1.5">
                  <PopoverLabel>Seed</PopoverLabel>
                  <div className="flex gap-2">
                    <Input
                      size="sm"
                      value={seed}
                      onChange={(event) => setSeed(event.target.value)}
                      placeholder="marketing-home-v2"
                      aria-label="Theme seed"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onPress={() => theme.applySeed(seed)}
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    The same seed always produces the same theme.
                  </p>
                </div>

                <Separator />

                <div className="flex flex-col gap-1.5">
                  <PopoverLabel>JSON</PopoverLabel>
                  <Textarea
                    size="sm"
                    rows={6}
                    value={jsonDraft}
                    onChange={(event) => setJsonDraft(event.target.value)}
                    onFocus={() => {
                      if (!jsonDraft) {
                        setJsonDraft(JSON.stringify(theme.toJSON(), null, 2));
                      }
                    }}
                    aria-label="Theme JSON"
                    error={Boolean(jsonError)}
                    className="min-h-32 font-mono text-[11px]"
                  />
                  {jsonError && (
                    <p className="text-[11px] text-destructive">{jsonError}</p>
                  )}
                  <Button
                    size="sm"
                    onPress={applyJson}
                    isDisabled={!jsonDraft}
                    className="w-full"
                  >
                    Apply JSON
                  </Button>
                </div>
              </div>
            )}
          </SettingRow>
        </SettingGroup>

        <Separator />

        <div className="flex flex-col gap-2 p-3">
          <Button
            leftIcon={css.copied ? <Check /> : <Copy />}
            onPress={() => void css.copy(theme.toCSS())}
            className="w-full"
          >
            {css.copied ? "CSS copied" : "Copy CSS"}
          </Button>
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Dices />}
              onPress={theme.shuffle}
            >
              Shuffle
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={json.copied ? <Check /> : <Copy />}
              onPress={() =>
                void json.copy(JSON.stringify(theme.toJSON(), null, 2))
              }
            >
              {json.copied ? "Copied" : "JSON"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<RotateCcw />}
              onPress={theme.reset}
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Preview, built from the real components so it always reflects the
          tokens as they currently are. */}
      <div className="flex min-w-0 flex-col gap-4">
        <Card>
          <Card.Header>
            <Card.Title className="text-sm">Controls</Card.Title>
            <Card.Description className="text-xs">
              {selection.customAccent ? "Custom" : accent.name} ·{" "}
              {selection.surface} · {activeRadius?.name ?? selection.radius} ·{" "}
              {activeEase?.name ?? "Custom easing"}
            </Card.Description>
          </Card.Header>

          <Card.Content className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Primary</Button>
                <Button size="sm" variant="outline">
                  Outline
                </Button>
                <Button size="sm" variant="ghost">
                  Ghost
                </Button>
                <Button size="sm" variant="destructive">
                  Delete
                </Button>
              </div>

              <Input placeholder="Text input" aria-label="Preview input" />

              {/* The new colour field, so the picker is visible on the page
                  it themes. */}
              <Input.Color
                defaultValue={accent.swatch}
                aria-label="Preview colour field"
                swatches={CURATED_COLOR_PRESETS.map(
                  (preset) => preset.swatch,
                ).slice(0, 6)}
              />

              <div className="flex flex-wrap items-center gap-2">
                <Badge>Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Error</Badge>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2.5">
                <span className="text-xs font-medium">Notifications</span>
                <Switch defaultSelected aria-label="Preview switch" />
              </div>

              <Slider
                label="Volume"
                showValue
                defaultValue={64}
                size="sm"
                aria-label="Preview slider"
              />

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium">Upload</span>
                <Progress value={72} />
              </div>

              <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Motion</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Play />}
                    onPress={() => setReplay((count) => count + 1)}
                  >
                    Replay
                  </Button>
                </div>
                {/* Remounting restarts the CSS animation, which is what makes
                    the chosen duration and easing visible. */}
                <div
                  key={replay}
                  className="h-1.5 overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className="h-full w-1/3 rounded-full bg-primary"
                    style={{
                      animationName: "theme-preview-sweep",
                      animationDuration: "var(--theme-motion-overlay-duration)",
                      animationTimingFunction:
                        "var(--theme-motion-ease-standard)",
                      animationFillMode: "both",
                      animationIterationCount: 1,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
