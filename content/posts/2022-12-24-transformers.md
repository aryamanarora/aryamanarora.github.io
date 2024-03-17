---
title: "Some intuitions about transformers"
layout: post
date: 2022-12-24
tags:
  - NLP
  - transformers
aliases:
    - "/20221224-transformers"
    - "/20221224-transformers.html"
description: "I've been thinking about transformers a lot recently."
---

Unless you have been living under a rock for the last five years, you
have definitely (if possibly unknowingly) somehow interacted with a
machine learning model that uses the transformer architecture. I have
spent a couple months poking at little transformer models like GPT-2 and
the 19 million-parameter version of
[Pythia](https://github.com/EleutherAI/pythia) and yet after working at
an interpretability startup for a week I realised that I actually don't
have a great understanding of how a transformer works. I was really only
superficially familiar with the computations that happen within them and
where weights are stored and so on. So this is a mishmash of some
thoughts I have about how they work, some of which are hard to
empirically verify and may be pure speculation. No claims of originality
here either.

## Attention

Attention is not really the best name for understanding how it works, at
least in the way it is utilised in the modern transformer as a repeated
and parallel operation involving multiple heads stacked in layers. I was
actually surprised to see while writing this that Bahdanau didn't really
call the mechanism he designed "attention" except for briefly in one
paragraph in the original paper, where he says:

> Intuitively, this implements a mechanism of attention in the decoder.
> The decoder decides parts of the source sentence to pay attention to.
> By letting the decoder have an attention mechanism, we relieve the
> encoder from the burden of having to encode all information in the
> source sentence into a fixedlength vector.
>
> *[Neural Machine Translation by Jointly Learning to Align and
> Translate](https://arxiv.org/pdf/1409.0473.pdf) (Bahdanau et al.,
> 2014)*

So it was first mentioned as an analogy rather than the all-encompassing
name for it. I wonder how that ended up different.

I think a better way of thinking about it in the context of the
transformer is as information flow. Attention is the mechanism that
transfers informations between fixed-memory token positions. A single
attention head has the dual job of (1) figuring out from where to where
information needs to be moved, and (2) actually doing that operation.
So, a previous-token attention head (such as head 4.11 in GPT-2 small)
is really moving information about a token to the next token. Each token
now includes information about its predecessor, so heads in layer 5 can
attend to just one token to know about bigrams.

If you think about attention as moving information around, it becomes
really clear why phenomena like cross-layer cooperation between heads
occur. A great example is how [induction
heads](https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html)
work: they promote generations like `[A][B]...[A]([B])`. It isn't
possible to do this with just one attention head in one layer (assuming
the distance between `[B]...[A]` is not fixed). A head can learn to
attend to copies of heads at the current position, but it can't
simultaneously move over information from one token over. Induction
heads don't show up in one layer models because a head in a layer lower
needs to create a landmark saying "I am a `[B]` preceded immediately by
an `[A]`, look at me."

Basically, the role of attention is to figure out what information to
move around and how to do so. If you buy that discrete linguistic
features are encoded in separable directions in embedding space (I think
this is mostly true given embedding arithmetic and [the ability to
remove information
linear-algebraically](https://aclanthology.org/2020.acl-main.647/), but
subject to caveats like [sparsity causing superposition of
features](https://transformer-circuits.pub/2022/toy_model/index.html)),
then attention should be able to pick specific features to copy over
(not just token embeddings in their entirety) thanks to the QKV
transforms.

## MLP

The MLP layers are annoying as hell to make sense of. Unfortunately, the
vast amount of computation (and this increases with scale) [happens in
the MLP
layers](https://twitter.com/stephenroller/status/1579993017234382849).
80% of the FLOPs in OPT-175B! Yet, the key difference from attention is
that MLPs do not move information around.

However, consider the recursive layer structure of a transformer. The
MLPs do operate on contextual information, using whatever stuff the
attention heads below them have moved into that token position. And the
two-layer structure (first multiplication followed by ReLU or another
non-linearity, then second multiplication) makes the MLP similar to the
KV-transform in attention.

Actually, thinking about it further, I think the MLPs are doing the same
thing as the post-attention matrix multiplication by OV. The only
difference is the addition of the ReLU which allows mass removal of
information. So maybe the MLP not only serves as a sort of lookup for
information to add without looking at other tokens (like it [seems to
encode knowledge](https://arxiv.org/abs/2202.05262)), but it also cleans
out unimportant information with the ReLU.

## LayerNorms

The LayerNorms don't, by definition, mess with the information contained
in the language model (if we fix the mean and variance of activations as
constants, then it's just a linear transformation; this is called
[folding
LayerNorm in](https://github.com/neelnanda-io/TransformerLens/blob/main/further_comments.md#what-is-layernorm-folding-fold_ln")) but they would rescale non-basis-aligned features
in weird ways so it's unclear what they do. I don't think they add
information by themselves (it's just rotating and scaling the embedding
information around), but the other mechanisms (attention and MLP) may
strategically exploit the LayerNorm to offload e.g. getting rid of
unimportant information.

## Conclusion

I read some hyperbole once on Twitter about how transformers are the
modern Turing machine or whatever. I think that's a silly comparison if
you're comparing their importance in the history of computing, since
it's very clear which one would not exist without the other. But on the
architectural level it's not a bad comparison. The tape of the
transformer is the information contained at each token position after
initial embedding. Attention is the instruction table and also moves the
head around and registers states. MLPs and layernorms modify things
inside a position in the tape without reference to other positions, but
can still leverage information the attention put in there.

Thinking about transformers this way also makes a stronger argument for
scaling, since the layer of a transformer obviously limits the attention
heads' chances to decide what information to move around. If you have 12
layers then you only have 12 chances to figure out what to move around
and do that. Like, your max depth is 12 even if you have 144 heads
total. Since we're dealing with natural language, this is enough for
most things but the long-tail and interesting phenomena get hurt. For
example, this makes it pretty clear why addition would be hard for
transformers, since you may have to carry over and store intermediate
sums way more than 12 times when dealing with big numbers. I bet this
also means adding breadth to the network (more parallel heads) will be
less powerful than adding a new layer.