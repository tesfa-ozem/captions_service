const allMediaType = {
    video:['mp4','mpeg','avi'],
    audio:[],
    image:[]
}

export const mediaTypes:string[] = Object.keys(allMediaType);
export const mediaExtentions: Map<string, string[]> = new Map(Object.entries(allMediaType))