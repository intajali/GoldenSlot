import { _decorator } from 'cc';
import { UIController } from './UIController';
import { FrontPanelView } from '../panelview/FrontPanelView';
import { UIControllerToken } from '../../core/base/UIControllerToken';
import { BaseBootstrap } from '../../core/base/BaseBootstrap';
import { FrontPanelUIController } from '../controller/FrontPanelUIController';
import { WinPopupView } from '../popup/view/WinPopupView';

import { PopupType } from '../../core/enum/PopupType';
import { PopupHandler } from '../popup/controller/PopupHandler';
import { AutoSpinPanelView } from '../panelview/AutoSpinPanelView';
import { AutoSpinPanelUIController } from '../controller/AutoSpinPanelUIController';
import { JackpotMeterView } from '../panelview/JackpotMeterView';
import { JackpotMeterViewUIController } from '../controller/JackpotMeterViewUIController';
import { FreeSpinCounterViewUIController } from '../controller/FreeSpinCounterViewUIController';
import { FreeSpinCounterView } from '../panelview/FreeSpinCounterView';
import { JackpotWinPopupView } from '../popup/view/JackpotWinPopupView';
import { SettingsPanelView } from '../panelview/SettingsPanelView';
import { SettingsPanelUIController } from '../controller/SettingsPanelUIController';
import { SoundSelectionPopupView } from '../popup/view/SoundSelectionPopupView';
import { LoadingPanelView } from '../panelview/LoadingPanelView';
import { LoadingPanelUIController } from '../controller/LoadingPanelUIController';
import { ErrorPopupView } from '../popup/view/ErrorPopupView';
import { DailyRewardsPanelView } from '../panelview/DailyRewardsPanelView';
import { DailyRewardsPanelUIController } from '../controller/DailyRewardsPanelUIController';
import { TestModePanelView } from '../panelview/TestModePanelView';
import { TestModePanelUIController } from '../controller/TestModePanelUIController';
import { GameRulesPanelView } from '../panelview/GameRulesPanelView';
import { GameRulesPanelUIController } from '../controller/GameRulesPanelUIController';
import { MenuPanelView } from '../panelview/MenuPanelView';
import { MenuPanelUIController } from '../controller/MenuPanelUIController';
import { JackpotFeaturePanelView } from '../panelview/JackpotFeaturePanelView';
import { JackpotFeatureUIController } from '../controller/JackpotFeatureUIController';
const { ccclass, property } = _decorator;

@ccclass('UIBootstrap')
export class UIBootstrap extends BaseBootstrap {


    @property(GameRulesPanelView)
    gameRulesPanelView: GameRulesPanelView;

    @property(FrontPanelView)
    frontPanelView: FrontPanelView;

    @property(MenuPanelView)
    menuPanelView: MenuPanelView;

    @property(AutoSpinPanelView)
    autospinPanelView: AutoSpinPanelView;

    @property(FreeSpinCounterView)
    freeSpinCounterView: FreeSpinCounterView;


    @property(JackpotMeterView)
    jackpotMeterView: JackpotMeterView;

    @property(SettingsPanelView)
    settingsPanelView: SettingsPanelView;

    @property(LoadingPanelView)
    loadingPanelView: LoadingPanelView;

    @property(DailyRewardsPanelView)
    dailyRewardsPanelView: DailyRewardsPanelView;

    @property(TestModePanelView)
    testModePanelView: TestModePanelView;

    @property(JackpotFeaturePanelView)
    jackpotFeaturePanelView: JackpotFeaturePanelView;

    //------------------------------------------------------------------
    // Popup Views
    //------------------------------------------------------------------
    @property(WinPopupView)
    winPopupView: WinPopupView;

    @property(JackpotWinPopupView)
    jackpotWinPopupView: JackpotWinPopupView;

    @property(SoundSelectionPopupView)
    soundSelectionPopupView: SoundSelectionPopupView;

    @property(ErrorPopupView)
    errorPopupView: ErrorPopupView;

    protected start(): void {

        // Register controllers and initialize UI system
        UIController.instance.load();

        const frontPanelController = new FrontPanelUIController(this.frontPanelView);
        UIController.instance.register(
            UIControllerToken.FRONT_PANEL,
            frontPanelController
        );


        const gameRulesPanelController = new GameRulesPanelUIController(this.gameRulesPanelView);
        UIController.instance.register(
            UIControllerToken.GAME_RULES_PANEL,
            gameRulesPanelController
        );

        const menuPanelController = new MenuPanelUIController(this.menuPanelView);
        UIController.instance.register(
            UIControllerToken.MENU_PANEL,
            menuPanelController
        );

        const autoSpinPanelController = new AutoSpinPanelUIController(this.autospinPanelView);
        UIController.instance.register(
            UIControllerToken.AUTO_SPIN_PANEL,
            autoSpinPanelController
        );

        const freeSpinCounterViewController = new FreeSpinCounterViewUIController(this.freeSpinCounterView);
        UIController.instance.register(
            UIControllerToken.FREE_SPIN_COUNTER_PANEL,
            freeSpinCounterViewController
        );

        const jackpotFeaturePanelController = new JackpotFeatureUIController(this.jackpotFeaturePanelView);
        UIController.instance.register(
            UIControllerToken.JACKPOT_FEATURE_PANEL,
            jackpotFeaturePanelController
        );

        const jackpotMeterViewController = new JackpotMeterViewUIController(this.jackpotMeterView);
        UIController.instance.register(
            UIControllerToken.JACKPOT_METER_PANEL,
            jackpotMeterViewController
        );

        const settingsPanelController = new SettingsPanelUIController(this.settingsPanelView);

        UIController.instance.register(
            UIControllerToken.SETTINGS_PANEL,
            settingsPanelController
        );

        const loadingPanelController = new LoadingPanelUIController(this.loadingPanelView);
        UIController.instance.register(
            UIControllerToken.LOADING_PANEL,
            loadingPanelController
        );

        const dailyRewardsPanelController = new DailyRewardsPanelUIController(this.dailyRewardsPanelView);
        UIController.instance.register(
            UIControllerToken.DAILY_REWARDS_PANEL,
            dailyRewardsPanelController
        );

        const testModePanelController = new TestModePanelUIController(this.testModePanelView);
        UIController.instance.register(
            UIControllerToken.TEST_MODE_PANEL,
            testModePanelController
        );


        UIController.instance.initAll();

        // Register popups

        PopupHandler.instance.register(PopupType.WIN,
            this.winPopupView
        );

        PopupHandler.instance.register(PopupType.JACKPOT_WIN,
            this.jackpotWinPopupView
        );

        PopupHandler.instance.register(PopupType.SOUND_SELECTION,
            this.soundSelectionPopupView
        );

        PopupHandler.instance.register(PopupType.ERROR,
            this.errorPopupView
        );


        // Show initial UI
        UIController.instance.show(UIControllerToken.LOADING_PANEL);
    }

    protected shotdown(): void {
        UIController.instance.destroy();
    }

    protected onDestroy(): void {
        this.shotdown();
    }
}

