const test=require('node:test'),assert=require('node:assert/strict'),B=require('../model');
function process(){const m=B.empty(),a=B.addNode(m,'start',100,100),b=B.addNode(m,'task',300,100),c=B.addNode(m,'end',500,100);B.addEdge(m,a.id,b.id);B.addEdge(m,b.id,c.id);return {m,a,b,c};}
test('Корректная модель',()=>assert.deepEqual(B.validate(process().m),[]));
test('Пустая модель',()=>assert.equal(B.validate(B.empty()).length,2));
test('Повторная связь',()=>{const {m,a,b}=process();assert.throws(()=>B.addEdge(m,a.id,b.id));});
test('Связь из конечного события',()=>{const {m,c,b}=process();assert.throws(()=>B.addEdge(m,c.id,b.id));});
test('Удаление связанных потоков',()=>{const {m,b}=process();B.remove(m,b.id);assert.equal(m.edges.length,0);});
test('Импорт JSON',()=>{const {m}=process();assert.deepEqual(B.parse(JSON.stringify(m)),m);});
test('Некорректный импорт',()=>assert.throws(()=>B.parse('{"nodes":[]}')));
test('Экспорт XML',()=>{const {m}=process();m.title='A & B';const xml=B.xml(m);assert.match(xml,/A &amp; B/);assert.match(xml,/bpmndi:BPMNEdge/);});
test('Недостижимая задача',()=>{const {m}=process();B.addNode(m,'task',100,300);assert.ok(B.validate(m).length>=4);});
