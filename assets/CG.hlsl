sampler s0 : register(s0);

float4 main(float2 tex : TEXCOORD0) : COLOR
{
    float4 rgb =tex2D(s0, tex);
    if(rgb[0] < 0.5 && rgb[1] > 0.5 && rgb[2] < 0.5) {
        rgb = float4(0, 0, 0, 1);
    }

    return rgb;
}