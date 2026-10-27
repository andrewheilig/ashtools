import{n as e,t}from"./index-CYOY0HYP.js";var n=e(),r={formal:{label:`Formal mathematics (default)`,description:`Definitions, theorems, formal problems, proofs, and constructions.`,text:`D:N={0,1,2,3,...} <eos>
    D:Z={...,−2,−1,0,1,2,...} <eos>
    D:Q={a/b|a,b∈Z∧b≠0} <eos>
    D:∀a,b∈Z[a|b⇔∃k∈Z[b=ak]] <eos>
    D:∀a,b∈Z[gcd(a,b)=gcd(b,a)] <eos>
    D:∀a,b∈Z[lcm(a,b)*gcd(a,b)=|ab|] <eos>
    D:prime(n)⇔n>1∧∀d∈N+[d|n⇒d=1∨d=n] <eos>
    D:even(n)⇔n mod 2=0 <eos>
    D:odd(n)⇔n mod 2=1 <eos>
    D:coprime(a,b)⇔gcd(a,b)=1 <eos>
    D:F(0)=0∧F(1)=1 <eos>
    D:∀n≥0[F(n+2)=F(n+1)+F(n)] <eos>
    D:L(0)=2∧L(1)=1 <eos>
    D:∀n≥0[L(n+2)=L(n+1)+L(n)] <eos>
    D:T(0)=0 <eos>
    D:∀n≥0[T(2n)=T(n)] <eos>
    D:∀n≥0[T(2n+1)=1−T(n)] <eos>
    D:binom(n,k)=n!/(k!(n−k)!) <eos>
    D:factorial(0)=1 <eos>
    D:∀n≥0[factorial(n+1)=(n+1)*factorial(n)] <eos>
    D:sum(S)=Σ(i=1..length(S),S[i]) <eos>
    D:mean(S)=sum(S)/length(S) <eos>
    D:range(a,b)={a,a+1,...,b} <eos>
    D:cardinality(S)=|S| <eos>
    D:subset(A,B)⇔∀x[x∈A⇒x∈B] <eos>
    D:distance2(p,q)=(px−qx)^2+(py−qy)^2 <eos>
    D:dot(p,q)=px*qx+py*qy <eos>
    D:cross(p,q)=px*qy−py*qx <eos>
    D:rotate90(x,y)=(−y,x) <eos>
    D:reflectX(x,y)=(x,−y) <eos>
    D:reflectY(x,y)=(−x,y) <eos>
    D:area2(p,q,r)=|cross(q−p,r−p)| <eos>
    D:collinear(p,q,r)⇔cross(q−p,r−p)=0 <eos>
    D:adjacent(u,v,G)⇔{u,v}∈E(G) <eos>
    D:degree(v,G)=|{u∈V(G)|adjacent(u,v,G)}| <eos>
    D:independent(S,G)⇔∀u,v∈S[u≠v⇒¬adjacent(u,v,G)] <eos>
    D:properColoring(c,G)⇔∀{u,v}∈E(G)[c(u)≠c(v)] <eos>
    D:palindrome(w)⇔reverse(w)=w <eos>
    D:period(w,p)⇔∀i[0≤i<length(w)−p⇒w[i]=w[i+p]] <eos>
    D:reachable(s,t,M)⇔∃k≥0[iterate(M,s,k)=t] <eos>
    
    T:∀a,b∈Z[a+b=b+a] <eos>
    T:∀a,b,c∈Z[a+(b+c)=(a+b)+c] <eos>
    T:∀a,b,c∈Z[a(b+c)=ab+ac] <eos>
    T:∀a∈Z[a+0=a] <eos>
    T:∀a∈Z[a*1=a] <eos>
    T:∀a∈Z[a*0=0] <eos>
    T:∀a∈Z[a^2≥0] <eos>
    T:∀a,b∈Z[(a+b)^2=a^2+2ab+b^2] <eos>
    T:∀a,b∈Z[(a−b)(a+b)=a^2−b^2] <eos>
    T:∀a,b∈Z[(a+b)^3=a^3+3a^2b+3ab^2+b^3] <eos>
    T:∀a,b∈Z[gcd(a,b)|a∧gcd(a,b)|b] <eos>
    T:∀a,b∈Z[a|b⇒a|bc] <eos>
    T:∀a,b,c∈Z[a|b∧b|c⇒a|c] <eos>
    T:∀a,b∈Z[gcd(a,b)=gcd(a,b+a)] <eos>
    T:∀a,b,k∈Z[gcd(a,b)=gcd(a,b+ka)] <eos>
    T:∀a,b∈N+[gcd(a,b)*lcm(a,b)=ab] <eos>
    T:∀n∈N[n(n+1) mod 2=0] <eos>
    T:∀n∈N[(n^3−n) mod 6=0] <eos>
    T:∀n∈N[n^2 mod 4∈{0,1}] <eos>
    T:∀n∈N[n^2 mod 3∈{0,1}] <eos>
    
    T:∀n∈N+[Σ(k=1..n,k)=n(n+1)/2] <eos>
    T:∀n∈N+[Σ(k=1..n,2k)=n(n+1)] <eos>
    T:∀n∈N+[Σ(k=1..n,k^2)=n(n+1)(2n+1)/6] <eos>
    T:∀n∈N+[Σ(k=1..n,(2k−1))=n^2] <eos>
    T:∀n∈N+[Σ(k=0..n,binom(n,k))=2^n] <eos>
    T:∀n∈N+[binom(n,0)=1] <eos>
    T:∀n∈N+[binom(n,n)=1] <eos>
    T:∀n≥1[∀k∈[1..n][binom(n,k)=binom(n,n−k)]] <eos>
    T:∀n≥1[∀k∈[1..n][binom(n,k)=binom(n−1,k)+binom(n−1,k−1)]] <eos>
    T:∀n≥0[F(n+2)=F(n+1)+F(n)] <eos>
    T:∀n≥0[F(2n)=F(n)(F(n−1)+F(n+1))] <eos>
    T:∀n≥0[L(n)=F(n−1)+F(n+1)] <eos>
    T:∀n≥0[T(2n)=T(n)] <eos>
    T:∀n≥0[T(2n+1)=1−T(n)] <eos>
    
    T:∀A,B[A∪B=B∪A] <eos>
    T:∀A,B[A∩B=B∩A] <eos>
    T:∀A[A∪∅=A] <eos>
    T:∀A[A∩A=A] <eos>
    T:∀A,B[A⊆A∪B] <eos>
    T:∀A,B[A∩B⊆A] <eos>
    T:∀A,B,C[A∩(B∪C)=(A∩B)∪(A∩C)] <eos>
    T:∀A,B,C[A∪(B∩C)=(A∪B)∩(A∪C)] <eos>
    
    T:∀p,q[distance2(p,q)=distance2(q,p)] <eos>
    T:∀p[distance2(p,p)=0] <eos>
    T:∀p[distance2(rotate90(p),O)=distance2(p,O)] <eos>
    T:∀p[distance2(reflectX(p),O)=distance2(p,O)] <eos>
    T:∀p,q[dot(p,q)=dot(q,p)] <eos>
    T:∀p,q[cross(p,q)=−cross(q,p)] <eos>
    T:∀p,q[cross(p,q)=0⇔collinear(O,p,q)] <eos>
    T:∀p,q,r[area2(p,q,r)=area2(q,r,p)] <eos>
    T:∀p,q,r[area2(p,q,r)=area2(p,r,q)] <eos>
    
    T:∀G[Σ(v∈V(G),degree(v,G))=2*|E(G)|] <eos>
    T:∀G[|{v∈V(G)|odd(degree(v,G))}| mod 2=0] <eos>
    T:∀G[χ(G)≤|V(G)|] <eos>
    T:∀G[α(G)≥1] | |V(G)|≥1 <eos>
    T:∀G[α(G)≤|V(G)|] <eos>
    T:∀G[|E(complement(G))|=binom(|V(G)|,2)−|E(G)|] <eos>
    
    P:FIND(x∈Z|3x+7=22) <eos>
    P:FIND(x∈Q|9x−5x−5=2) <eos>
    P:FIND(x∈Q|x/(x+9)=2/3) <eos>
    P:FIND(x∈Z|x^2−7x+12=0) <eos>
    P:FIND((x,y)∈Z^2|x+y=13∧x−y=3) <eos>
    P:FIND(x∈N|x mod 3=2∧x mod 5=4∧x<50) <eos>
    P:COUNT(x∈[1..100]|x mod 4=1) <eos>
    P:COUNT(x∈[1..200]|prime(x)) <eos>
    P:MAX(x∈Z|x^2−9x+18≤0) <eos>
    P:MIN(x∈Z|x>0∧x mod 4=3∧x mod 5=2) <eos>
    
    P:FIND(n∈N|Σ(k=1..n,k)=210) <eos>
    P:FIND(n∈N|binom(n,2)=45) <eos>
    P:FIND(x∈N|gcd(x,18)=6∧lcm(x,18)=90) <eos>
    P:COUNT(S⊆{1,2,3,4,5}|cardinality(S)=3) <eos>
    P:MAX(cardinality(S)|S⊆V(G)∧independent(S,G)) <eos>
    P:COUNT(c:V(G)→{1,2,3}|properColoring(c,G)) <eos>
    
    P:FIND(p∈Z^2|distance2(p,O)=25∧px>0∧py>0) <eos>
    P:COUNT(p∈Z^2|distance2(p,O)=25) <eos>
    P:MAX(area2(O,p,q)|p,q∈{0..4}^2) <eos>
    P:FIND(x∈Z|distance2((x,3),O)=34) <eos>
    P:COUNT((a,b)∈N^2|a≤b≤20∧a^2+b^2=125) <eos>
    
    P:PROVE(∀n∈N[n(n+1) mod 2=0]) <eos>
    P:PROVE(∀n∈N[(n^3−n) mod 6=0]) <eos>
    P:PROVE(∀a,b∈Z[gcd(a,b)=gcd(a,b+a)]) <eos>
    P:PROVE(∀A,B[A∩B⊆A∪B]) <eos>
    P:PROVE(∀p,q[distance2(p,q)=distance2(q,p)]) <eos>
    P:PROVE(∀G[Σ(v∈V(G),degree(v,G))=2|E(G)|]) <eos>
    
    P:DETERMINE(∀n≥1[F(n)>0]) <eos>
    P:DETERMINE(∀n∈N[n^2 mod 4∈{0,1}]) <eos>
    P:DETERMINE(∀n∈N[n^2 mod 4=1]) <eos>
    P:DETERMINE(∀x∈Z[x^2≥x]) <eos>
    
    P:CONSTRUCT(S⊆{1..10}|cardinality(S)=4∧sum(S)=20) <eos>
    P:CONSTRUCT(p,q,r∈Z^2|area2(p,q,r)=12) <eos>
    P:CONSTRUCT(G|cardinality(V(G))=6∧cardinality(E(G))=9) <eos>
    P:CONSTRUCT(w∈{0,1}^8|ones(w)=4∧palindrome(w)) <eos>
    
    `},arithmetic:{label:`Arithmetic facts`,description:`Addition, subtraction, multiplication, percentages, and equations.`,text:`what is 12 plus 7? the answer is 19. <eos>
what is 28 plus 35? the answer is 63. <eos>
what is 91 minus 46? the answer is 45. <eos>
what is 72 minus 19? the answer is 53. <eos>
what is 8 times 9? the answer is 72. <eos>
what is 14 times 6? the answer is 84. <eos>
25 percent of 80 is 20. <eos>
40 percent of 150 is 60. <eos>
solve 3x + (4) = 25. the solution is x = 7. <eos>
solve 5x + (-10) = 30. the solution is x = 8. <eos>
a bag has 7 red beads and 11 blue beads. there are 18 beads. <eos>
6 notebooks cost 42 dollars. each costs 7 dollars. <eos>
the pattern 2, 5, 8, 11 adds 3 each time. <eos>
the pattern 10, 15, 20, 25 adds 5 each time. <eos>`},language:{label:`Language patterns`,description:`Simple descriptive and narrative sentence structures.`,text:`at the library, an artist asks a question. <eos>
near the river, a gardener reads a book. <eos>
in the morning, a student solves a puzzle. <eos>
after the lesson, a teacher explains the result. <eos>
the room is small, but the other one is bright. <eos>
the stone is rough, but the other one is smooth. <eos>
a scientist checks the clock at the station. <eos>
a programmer writes a note before lunch. <eos>
the cat sleeps quietly in the sun. <eos>
the dog runs quickly through the garden. <eos>
a child finds a pattern and explains the idea. <eos>
a baker counts the steps near the river. <eos>`},reasoning:{label:`Reasoning statements`,description:`Definitions, comparisons, conjectures, and counterexamples.`,text:`a prediction is not always the same as an observation. <eos>
a sample is a subset of a population. <eos>
a median is the middle value of sorted data. <eos>
a mean is the total divided by the count. <eos>
a counterexample disproves a general claim. <eos>
a pattern may suggest a useful conjecture. <eos>
correlation does not by itself establish causation. <eos>
an outlier is far from most observations. <eos>
to check a claim, try a smaller example first. <eos>
an invariant remains unchanged during an allowed move. <eos>
evidence can support a claim without proving it. <eos>
a square is a rectangle with four equal sides. <eos>`}};function i(e){return e.split(/\r?\n/).map(e=>e.trim()).filter(Boolean).map(e=>e.includes(`<eos>`)?e:`${e} <eos>`).join(`
`)}var a=1e-9;function o(e){let t=Math.sqrt(2/Math.PI);return .5*e*(1+Math.tanh(t*(e+.044715*e**3)))}function s(e){let t=Math.sqrt(2/Math.PI),n=t*(e+.044715*e**3),r=Math.tanh(n),i=t*(1+.134145*e**2);return .5*(1+r)+.5*e*(1-r**2)*i}function c(e,t=1){let n=e.map(e=>e/t),r=Math.max(...n),i=n.map(e=>Math.exp(e-r)),o=i.reduce((e,t)=>e+t,0);return i.map(e=>e/(o+a))}function l(e,t){return-Math.log(t[e]+a)}function u(e,t,n=.8){let r=e.slice();--r[t];let i=1/n;for(let e=0;e<r.length;e++)r[e]*=i;return r}function d(e,t=1){return Math.max(-t,Math.min(t,e))}function f(e,t,n=1.2){let r=e.slice();for(let e of t)r[e]/=n;return r}function p(e){for(let t=e.length-1;t>0;t--){let n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}}function m(e){return Array(e).fill(0)}function h(e,t){return Array.from({length:e},()=>Array.from({length:t},()=>(Math.random()*2-1)*.02))}function g(e,t){let n=0;for(let r=0;r<e.length;r++)n+=e[r]*t[r];return n}var _=class{constructor(e){this.d=e,this.WQ=h(e,e),this.WK=h(e,e),this.WV=h(e,e)}proj(e,t){return t.map(t=>g(t,e))}forward(e){let t=e.map(e=>this.proj(e,this.WQ)),n=e.map(e=>this.proj(e,this.WK)),r=e.map(e=>this.proj(e,this.WV)),i=[],a=Math.sqrt(this.d);return{out:e.map((e,o)=>{let s=[];for(let e=0;e<=o;e++)s.push(g(t[o],n[e])/a);let l=c(s);i.push(l);let u=m(this.d);for(let e=0;e<=o;e++)for(let t=0;t<this.d;t++)u[t]+=l[e]*r[e][t];return u}),cache:{seq:e,Q:t,K:n,V:r,weights:i}}}backwardLast(e,t,n){let{seq:r,Q:i,K:a,V:o,weights:s}=e,c=r.length-1,l=s[c],u=o.map(e=>g(t,e)),f=g(u,l),p=l.map((e,t)=>e*(u[t]-f)),h=m(this.d),_=r.map(()=>m(this.d)),v=r.map(()=>m(this.d)),y=Math.sqrt(this.d);for(let e=0;e<r.length;e++)for(let n=0;n<this.d;n++)v[e][n]+=l[e]*t[n],h[n]+=p[e]*a[e][n]/y,_[e][n]+=p[e]*i[c][n]/y;let b=r.map(()=>m(this.d));for(let e=0;e<r.length;e++)for(let t=0;t<this.d;t++)for(let n=0;n<this.d;n++)b[e][n]+=this.WK[t][n]*_[e][t],b[e][n]+=this.WV[t][n]*v[e][t];for(let e=0;e<this.d;e++)for(let t=0;t<this.d;t++)b[c][t]+=this.WQ[e][t]*h[e];for(let e=0;e<this.d;e++)for(let t=0;t<this.d;t++){this.WQ[e][t]-=n*d(h[e]*r[c][t]);let i=0,a=0;for(let n=0;n<r.length;n++)i+=_[n][e]*r[n][t],a+=v[n][e]*r[n][t];this.WK[e][t]-=n*d(i),this.WV[e][t]-=n*d(a)}return b}},v=class{constructor(e,t){this.W1=h(t,e),this.W2=h(e,t)}forward(e){let t=this.W1.map(t=>g(t,e)),n=t.map(o);return{out:this.W2.map(e=>g(e,n)),cache:{x:e,pre:t,hidden:n}}}backward(e,t,n){let{x:r,pre:i,hidden:a}=e,o=a.map((e,n)=>this.W2.reduce((e,r,i)=>e+r[n]*t[i],0)).map((e,t)=>e*s(i[t])),c=r.map((e,t)=>this.W1.reduce((e,n,r)=>e+n[t]*o[r],0));for(let e=0;e<this.W2.length;e++)for(let r=0;r<a.length;r++)this.W2[e][r]-=n*d(t[e]*a[r]);for(let e=0;e<this.W1.length;e++)for(let t=0;t<r.length;t++)this.W1[e][t]-=n*d(o[e]*r[t]);return c}};function y(e,t=1e-5){let n=e.reduce((e,t)=>e+t,0)/e.length,r=e.reduce((e,t)=>e+(t-n)**2,0)/e.length,i=Math.sqrt(r+t),a=e.map(e=>(e-n)/i);return{out:a,cache:{out:a,std:i}}}function b(e,t){let{out:n,std:r}=t,i=n.length,a=e.reduce((e,t)=>e+t,0),o=e.reduce((e,t,r)=>e+t*n[r],0);return e.map((e,t)=>(i*e-a-n[t]*o)/(i*r))}var x=class{constructor(e,t,n,r){this.tokenEmb=h(e,n),this.posEmb=h(t,n),this.attn=new _(n),this.ffn=new v(n,r)}forwardWithCache(e){let t=e.map((e,t)=>this.tokenEmb[e].map((e,n)=>e+this.posEmb[t][n])),n=this.attn.forward(t),r=t.map((e,t)=>e.map((e,r)=>e+n.out[t][r])).map(e=>y(e)),i=r.map(e=>this.ffn.forward(e.out)),a=r.map((e,t)=>e.out.map((e,n)=>e+i[t].out[n])).map(e=>y(e));return{out:a.map(e=>e.out),cache:{tokens:e,attention:n.cache,norm1:r,ffn:i,norm2:a}}}forward(e){return this.forwardWithCache(e).out}backwardLast(e,t,n){let{tokens:r,attention:i,norm1:a,ffn:o,norm2:s}=e,c=r.length-1,l=b(t,s[c].cache),u=b(this.ffn.backward(o[c].cache,l,n).map((e,t)=>e+l[t]),a[c].cache),f=r.map(()=>m(t.length));for(let e=0;e<t.length;e++)f[c][e]+=u[e];let p=this.attn.backwardLast(i,u,n);for(let e=0;e<r.length;e++)for(let i=0;i<t.length;i++){f[e][i]+=p[e][i];let t=d(f[e][i]);this.tokenEmb[r[e]][i]-=n*t,this.posEmb[e][i]-=n*t}}},S=class{constructor(e,t,n,r){this.block=new x(e,t,n,r),this.Wo=h(e,n),this.bo=m(e)}forward(e,t=1,n=!1){let r=this.block.forwardWithCache(e),i=r.out.at(-1),a=this.Wo.map((e,t)=>g(e,i)+this.bo[t]);return{h:i,logits:a,probs:c(a,t),blockCache:n?r.cache:null}}trainStep(e,t,n=.01,r=1){let{h:i,probs:a,blockCache:o}=this.forward(e,r,!0),s=l(t,a),c=u(a,t,r),f=m(i.length);for(let e=0;e<this.Wo.length;e++)for(let t=0;t<i.length;t++)f[t]+=this.Wo[e][t]*c[e];for(let e=0;e<this.Wo.length;e++){for(let t=0;t<i.length;t++)this.Wo[e][t]-=n*d(c[e]*i[t]);this.bo[e]-=n*d(c[e])}return this.block.backwardLast(o,f,n),s}forwardForGeneration(e,t=1.2,n=1.3,r=5){let i=this.block.forward(e).at(-1);return{probs:c(f(this.Wo.map((e,t)=>g(e,i)+this.bo[t]),e.slice(-r),n),t)}}};function C(e){return e.toLowerCase().replace(/\s+/g,` `)}function w(e,[t,n]){let r=t+n;return e.map(e=>{let i=[];for(let a=0;a<e.length;)e[a]===t&&e[a+1]===n?(i.push(r),a+=2):i.push(e[a++]);return i})}function T(e){return(e.match(/<eos>|[a-z0-9]+|[^a-z0-9\s]|\s+/g)||[]).map(e=>/^[a-z0-9]+$/.test(e)?e.split(``):[e])}function E(e,t){let n=T(e);for(let e of t)n=w(n,e);return n.flat()}function D(e,t=50){let n=T(e),r=[],i=new Set(n.flat());for(let e=0;e<t;e++){let e={};for(let t of n)if(t.length!==1||t[0]!==`<eos>`)for(let n=0;n<t.length-1;n++){let r=t[n]+`||`+t[n+1];e[r]=(e[r]||0)+1}let t=Object.entries(e).sort((e,t)=>t[1]-e[1])[0];if(!t)break;let a=t[0].split(`||`);r.push(a),i.add(a[0]+a[1]),n=w(n,a)}return{tokens:n.flat(),learnedMerges:r,vocabTokens:[...i]}}var O=1e-9;function k(e,t){let n=new Map;for(let r=1;r<e.length;r++){let i=Math.min(t,r);for(let t=1;t<=i;t++){let i=e.slice(r-t,r).join(`,`),a=n.get(i)||new Map,o=e[r];a.set(o,(a.get(o)||0)+1),n.set(i,a)}}return n}function A(e,t,n){if(!e)return null;for(let r=Math.min(n,t.length);r>=1;r--){let n=e.get(t.slice(-r).join(`,`));if(n)return[...n.entries()].reduce((e,t)=>t[1]>e[1]?t:e)[0]}return null}function j(e,t,n,r,i,a,o=20){let s=[],c=t.slice(-i);for(let t=0;t<o;t++){let t=c.slice(-i),{probs:o}=e.forwardForGeneration(t,1.2,1.3,5);console.log(`Context:`,JSON.stringify(t.map(e=>n[e]).join(``))),console.log(`EOS probability:`,o[r[`<eos>`]]),console.table(o.map((e,t)=>({token:JSON.stringify(n[t]),probability:e})).sort((e,t)=>t.probability-e.probability).slice(0,10));let l=A(a,t,i)??o.indexOf(Math.max(...o));if(console.log(`Selected token:`,JSON.stringify(n[l]),`probability:`,o[l]),c.push(l),n[l]===`<eos>`)break;s.push(n[l])}return s.join(``)}function M(e,t=[],n=10,r=.9){let i=new Set(t),a=e.map((e,t)=>({id:t,score:Math.log(e+O)/r})).filter(e=>!i.has(e.id)).sort((e,t)=>t.score-e.score).slice(0,n),o=Math.max(...a.map(e=>e.score)),s=a.map(e=>Math.exp(e.score-o)),c=s.reduce((e,t)=>e+t,0),l=Math.random()*c;for(let e=0;e<a.length;e++)if(l-=s[e],l<=0)return a[e].id;return a.at(-1).id}function N(e,t,n,r,i,a=40){let o=[],s=t.slice(-i),c=r[`<eos>`];for(let t=0;t<a;t++){let t=s.slice(-i),{probs:r}=e.forwardForGeneration(t,1,1.15,5),a=M(r,[],10,.9);if(s.push(a),a===c)break;o.push(n[a])}return o.join(``)}function P(e){return e.toLowerCase().replace(/\s+/g,` `).trim()}function F(e){let t=P(e),n=t.match(/what is (-?\d+) (plus|minus|times) (-?\d+)\?\s*the answer is (-?\d+)/);if(n){let e=Number(n[1]),t=Number(n[3]),r=Number(n[4]),i=n[2]===`plus`?e+t:n[2]===`minus`?e-t:e*t;return i===r?{status:`verified`,reason:`${e} ${n[2]} ${t} = ${i}`}:{status:`rejected`,reason:`Counterexample: the correct result is ${i}, not ${r}.`}}if(n=t.match(/solve (-?\d+)x \+ \((-?\d+)\) = (-?\d+).*?x = (-?\d+)/),n){let e=Number(n[1]),t=Number(n[2]),r=Number(n[3]),i=Number(n[4]),a=e*i+t;return a===r?{status:`verified`,reason:`Substitution gives ${e}×${i} + (${t}) = ${r}.`}:{status:`rejected`,reason:`Counterexample: substituting x = ${i} gives ${a}, not ${r}.`}}if(n=t.match(/a number times (-?\d+), then plus (-?\d+), gives (-?\d+)\. the number is (-?\d+)/),n){let e=Number(n[1]),t=Number(n[2]),r=Number(n[3]),i=Number(n[4]),a=i*e+t;return a===r?{status:`verified`,reason:`${i}×${e} + ${t} = ${r}`}:{status:`rejected`,reason:`Counterexample: the left side equals ${a}, not ${r}.`}}if(n=t.match(/a bag has (\d+) red beads and (\d+) blue beads\. there are (\d+) beads/),n){let e=Number(n[1]),t=Number(n[2]),r=Number(n[3]),i=e+t;return i===r?{status:`verified`,reason:`${e} + ${t} = ${i}`}:{status:`rejected`,reason:`Counterexample: there are ${i} beads, not ${r}.`}}if(n=t.match(/(\d+) (?:tickets|candles|apples|pencils|notebooks|oranges) cost (\d+) dollars\. each costs (\d+) dollars/),n){let e=Number(n[1]),t=Number(n[2]),r=Number(n[3]),i=e*r;return i===t?{status:`verified`,reason:`${e} × ${r} = ${t}`}:{status:`rejected`,reason:`Counterexample: ${e} × ${r} = ${i}, not ${t}.`}}if(n=t.match(/(\d+) percent of (\d+) is (\d+)/),n){let e=Number(n[1]),t=Number(n[2]),r=Number(n[3]),i=e*t/100;return i===r?{status:`verified`,reason:`${e}% of ${t} = ${i}`}:{status:`rejected`,reason:`Counterexample: ${e}% of ${t} is ${i}, not ${r}.`}}if(n=t.match(/the pattern (-?\d+), (-?\d+), (-?\d+), (-?\d+) adds (-?\d+) each time/),n){let e=n.slice(1,5).map(Number),t=Number(n[5]),r=e.slice(1).map((t,n)=>t-e[n]);return r.every(e=>e===t)?{status:`verified`,reason:`Every consecutive difference is ${t}.`}:{status:`rejected`,reason:`Counterexample: the differences are ${r.join(`, `)}.`}}return{status:`unverified`,reason:`The JavaScript verifier does not recognize this claim format.`}}function I(e,t,n,r,i=10){let a=[],o=new Set,s=new Set(e.corpusStatements),c=i*6;for(let l=0;l<c&&a.length<i;l++){let i=`${t}${N(e.model,n,e.vocab,e.id,e.contextLength,r)}`.trim(),c=P(i);!c||o.has(c)||s.has(c)||(o.add(c),a.push({text:i,...F(i)}))}return a}function L(e,t){if(t.length===0)return-1;for(let n=0;n<=e.length-t.length;n++){let r=!0;for(let i=0;i<t.length;i++)if(e[n+i]!==t[i]){r=!1;break}if(r)return n}return-1}function R(e,t,n=20){let r=L(e.corpusIds,t);if(r===-1){let n=e.corpusIds.slice(0,t.length),r=t.findIndex((e,t)=>e!==n[t]),i=e.vocab[t[r]],a=e.vocab[n[r]];return`Encoding check: no exact token-ID match was found. First corpus-prefix mismatch at token ${r}: prompt ${JSON.stringify(i)} (ID ${t[r]}), corpus ${JSON.stringify(a)} (ID ${n[r]}).`}let i=r+t.length,a=e.corpusIds.slice(i,i+n),o=t.slice(-e.contextLength),s=0,c=0,l=null;for(let t=0;t<a.length;t++){c++;let n=a[t],{probs:r}=e.model.forward(o.slice(-e.contextLength),1),i=r.indexOf(Math.max(...r));if(i===n?s++:l||={step:t+1,expected:e.vocab[n],predicted:e.vocab[i]},o.push(n),e.vocab[n]===`<eos>`)break}let u=l?` First mismatch at step ${l.step}: expected ${JSON.stringify(l.expected)}, predicted ${JSON.stringify(l.predicted)}.`:` No mismatches.`;return`Encoding check: exact token-ID match at corpus index ${r}. Teacher-forced top-1: ${s}/${c}.${u}`}var z=t();function B(){let[e,t]=(0,n.useState)(``),[a,o]=(0,n.useState)(``),[s,c]=(0,n.useState)(!1),[l,u]=(0,n.useState)(``),[d,f]=(0,n.useState)([]),[m,h]=(0,n.useState)(40),[g,_]=(0,n.useState)(`formal`),[v,y]=(0,n.useState)(``),[b,x]=(0,n.useState)(()=>({label:r.formal.label,text:r.formal.text,revision:0})),w=(0,n.useRef)(null);return(0,n.useEffect)(()=>{let e=!1,n=()=>new Promise(e=>setTimeout(e,0));return(async()=>{if(c(!1),w.current=null,f([]),u(``),t(`Preparing training data...`),await n(),e)return;let r=b.text,i=D(C(r),40),a=i.tokens,o=[...new Set([...i.vocabTokens,`<unk>`])],s=Object.fromEntries(o.map((e,t)=>[e,t])),l=a.map(e=>s[e]),d=k(l,16),m=new S(o.length,16,24,48),h=[];for(let e=0;e<l.length-1;e++)h.push({prefix:l.slice(Math.max(0,e+1-16),e+1),next:l[e+1]});for(let r=0;r<16;r++){p(h);let i=h,a=0;for(let o=0;o<i.length;o++){let s=i[o];if(a+=m.trainStep(s.prefix,s.next,.01,1),o%32==31||o===i.length-1){let a=Math.round((o+1)/i.length*100);if(t(`Training epoch ${r+1}/16: ${o+1}/${i.length} (${a}%)`),await n(),e)return}}console.log(`epoch`,r,`avg loss`,(a/i.length).toFixed(3))}console.log(`EOS in vocab:`,o.includes(`<eos>`),`EOS index:`,o.indexOf(`<eos>`)),e||(w.current={model:m,vocab:o,id:s,learnedMerges:i.learnedMerges,contextLength:16,continuationMemory:d,corpusIds:l,corpusStatements:C(r).split(`<eos>`).map(P).filter(Boolean)},c(!0),t(j(m,l.slice(0,3),o,s,16,d)))})().catch(n=>{console.error(n),e||t(`Training failed: ${n.message}`)}),()=>{e=!0}},[b]),(0,z.jsxs)(`div`,{className:`App`,children:[(0,z.jsxs)(`section`,{className:`corpus-controls`,children:[(0,z.jsx)(`h3`,{children:`Training corpus`}),(0,z.jsx)(`label`,{htmlFor:`corpus-choice`,children:`Corpus:`}),` `,(0,z.jsxs)(`select`,{id:`corpus-choice`,value:g,onChange:e=>_(e.target.value),children:[Object.entries(r).map(([e,t])=>(0,z.jsx)(`option`,{value:e,children:t.label},e)),(0,z.jsx)(`option`,{value:`custom`,children:`Paste your own`})]}),` `,(0,z.jsx)(`button`,{type:`button`,onClick:()=>{if(g===`custom`){let e=i(v);if(!e)return;x({label:`Custom corpus`,text:e,revision:Date.now()});return}let e=r[g];x({label:e.label,text:e.text,revision:Date.now()})},disabled:g===`custom`&&!v.trim(),children:`Train selected corpus`}),(0,z.jsxs)(`p`,{children:[`Active: `,b.label]}),g!==`custom`&&(0,z.jsx)(`p`,{children:r[g].description}),g===`custom`&&(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)(`label`,{htmlFor:`custom-corpus`,children:`One training example per line:`}),(0,z.jsx)(`textarea`,{id:`custom-corpus`,rows:`10`,value:v,onChange:e=>y(e.target.value),placeholder:`what is 2 plus 3? the answer is 5.
a triangle has three sides.`}),(0,z.jsx)(`small`,{children:`Missing <eos> markers are appended automatically.`})]})]}),(0,z.jsxs)(`form`,{onSubmit:e=>{e.preventDefault();let n=w.current;if(!n||!a.trim())return;let r=E(C(a),n.learnedMerges),i=n.id[`<unk>`],o=r.map(e=>n.id[e]??i),s=L(n.corpusIds,o)!==-1,c=j(n.model,o,n.vocab,n.id,n.contextLength,s?n.continuationMemory:null,m);t(c),u(R(n,o))},children:[(0,z.jsx)(`label`,{htmlFor:`prompt`,children:`Text to continue:`}),` `,(0,z.jsx)(`input`,{id:`prompt`,value:a,onChange:e=>o(e.target.value),placeholder:`Type a prompt`}),` `,(0,z.jsx)(`label`,{htmlFor:`max-output-tokens`,children:`Max output tokens:`}),` `,(0,z.jsx)(`input`,{id:`max-output-tokens`,type:`number`,min:`1`,max:`200`,value:m,onChange:e=>{let t=Number(e.target.value);h(Math.min(200,Math.max(1,t||1)))}}),` `,(0,z.jsx)(`button`,{type:`submit`,disabled:!s||!a.trim(),children:`Continue`}),` `,(0,z.jsx)(`button`,{type:`button`,onClick:()=>{let e=w.current;if(!e||!a.trim())return;let t=E(C(a),e.learnedMerges),n=e.id[`<unk>`],r=t.map(t=>e.id[t]??n);f(I(e,a,r,m,10))},disabled:!s||!a.trim(),children:`Generate new candidates`})]}),(0,z.jsx)(`h3`,{children:`Continuation:`}),(0,z.jsx)(`p`,{style:{whiteSpace:`pre-wrap`},children:e}),l&&(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)(`h3`,{children:`Diagnostic:`}),(0,z.jsx)(`p`,{children:l})]}),d.length>0&&(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)(`h3`,{children:`Novel candidates:`}),(0,z.jsx)(`ol`,{children:d.map((e,t)=>(0,z.jsxs)(`li`,{children:[(0,z.jsx)(`p`,{children:e.text}),(0,z.jsxs)(`small`,{children:[e.status.toUpperCase(),`: `,e.reason]})]},`${e.text}-${t}`))})]})]})}export{B as default};