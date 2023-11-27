import { CompleteHocuspocusProviderWebsocketConfiguration, HocuspocusProviderWebsocket } from './HocuspocusProviderWebsocket.js';
export type TiptapCollabProviderWebsocketConfiguration = Partial<CompleteHocuspocusProviderWebsocketConfiguration> & AdditionalTiptapCollabProviderWebsocketConfiguration;
export interface AdditionalTiptapCollabProviderWebsocketConfiguration {
    /**
     * A Hocuspocus Cloud App ID, get one here: https://collab.tiptap.dev
     */
    appId: string;
}
export declare class TiptapCollabProviderWebsocket extends HocuspocusProviderWebsocket {
    constructor(configuration: TiptapCollabProviderWebsocketConfiguration);
}
