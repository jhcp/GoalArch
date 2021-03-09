/* This file was generated by SableCC (http://www.sablecc.org/). */

package parser;

import lexer.*;
import node.*;
import analysis.*;
import java.util.*;

import java.io.DataInputStream;
import java.io.BufferedInputStream;
import java.io.IOException;

@SuppressWarnings("nls")
public class Parser
{
    public final Analysis ignoredTokens = new AnalysisAdapter();

    protected ArrayList<Object> nodeList;

    private final Lexer lexer;
    private final ListIterator<Object> stack = new LinkedList<Object>().listIterator();
    private int last_pos;
    private int last_line;
    private Token last_token;
    private final TokenIndex converter = new TokenIndex();
    private final int[] action = new int[2];

    private final static int SHIFT = 0;
    private final static int REDUCE = 1;
    private final static int ACCEPT = 2;
    private final static int ERROR = 3;

    public Parser(@SuppressWarnings("hiding") Lexer lexer)
    {
        this.lexer = lexer;
    }

    protected void filter() throws ParserException, LexerException, IOException
    {
        // Empty body
    }

    private void push(int numstate, ArrayList<Object> listNode, boolean hidden) throws ParserException, LexerException, IOException
    {
        this.nodeList = listNode;

        if(!hidden)
        {
            filter();
        }

        if(!this.stack.hasNext())
        {
            this.stack.add(new State(numstate, this.nodeList));
            return;
        }

        State s = (State) this.stack.next();
        s.state = numstate;
        s.nodes = this.nodeList;
    }

    private int goTo(int index)
    {
        int state = state();
        int low = 1;
        int high = gotoTable[index].length - 1;
        int value = gotoTable[index][0][1];

        while(low <= high)
        {
            // int middle = (low + high) / 2;
            int middle = (low + high) >>> 1;

            if(state < gotoTable[index][middle][0])
            {
                high = middle - 1;
            }
            else if(state > gotoTable[index][middle][0])
            {
                low = middle + 1;
            }
            else
            {
                value = gotoTable[index][middle][1];
                break;
            }
        }

        return value;
    }

    private int state()
    {
        State s = (State) this.stack.previous();
        this.stack.next();
        return s.state;
    }

    private ArrayList<Object> pop()
    {
        return ((State) this.stack.previous()).nodes;
    }

    private int index(Switchable token)
    {
        this.converter.index = -1;
        token.apply(this.converter);
        return this.converter.index;
    }

    @SuppressWarnings("unchecked")
    public Start parse() throws ParserException, LexerException, IOException
    {
        push(0, null, true);
        List<Node> ign = null;
        while(true)
        {
            while(index(this.lexer.peek()) == -1)
            {
                if(ign == null)
                {
                    ign = new LinkedList<Node>();
                }

                ign.add(this.lexer.next());
            }

            if(ign != null)
            {
                this.ignoredTokens.setIn(this.lexer.peek(), ign);
                ign = null;
            }

            this.last_pos = this.lexer.peek().getPos();
            this.last_line = this.lexer.peek().getLine();
            this.last_token = this.lexer.peek();

            int index = index(this.lexer.peek());
            this.action[0] = Parser.actionTable[state()][0][1];
            this.action[1] = Parser.actionTable[state()][0][2];

            int low = 1;
            int high = Parser.actionTable[state()].length - 1;

            while(low <= high)
            {
                int middle = (low + high) / 2;

                if(index < Parser.actionTable[state()][middle][0])
                {
                    high = middle - 1;
                }
                else if(index > Parser.actionTable[state()][middle][0])
                {
                    low = middle + 1;
                }
                else
                {
                    this.action[0] = Parser.actionTable[state()][middle][1];
                    this.action[1] = Parser.actionTable[state()][middle][2];
                    break;
                }
            }

            switch(this.action[0])
            {
                case SHIFT:
		    {
		        ArrayList<Object> list = new ArrayList<Object>();
		        list.add(this.lexer.next());
                        push(this.action[1], list, false);
                    }
		    break;
                case REDUCE:
                    {
                        int reduction = this.action[1];
                        if(reduction < 500) reduce_0(reduction);
                    }
                    break;
                case ACCEPT:
                    {
                        EOF node2 = (EOF) this.lexer.next();
                        PExp node1 = (PExp) pop().get(0);
                        Start node = new Start(node1, node2);
                        return node;
                    }
                case ERROR:
                    throw new ParserException(this.last_token,
                        "[" + this.last_line + "," + this.last_pos + "] " +
                        Parser.errorMessages[Parser.errors[this.action[1]]]);
            }
        }
    }

    private void reduce_0(int reduction) throws IOException, LexerException, ParserException
    {
        switch(reduction)
        {
            case 0: /* reduce ATermExp */
            {
                ArrayList<Object> list = new0();
                push(goTo(0), list, false);
            }
            break;
            case 1: /* reduce ASequenceExp */
            {
                ArrayList<Object> list = new1();
                push(goTo(0), list, false);
            }
            break;
            case 2: /* reduce AFactorTerm */
            {
                ArrayList<Object> list = new2();
                push(goTo(1), list, false);
            }
            break;
            case 3: /* reduce AAlternativeTerm */
            {
                ArrayList<Object> list = new3();
                push(goTo(1), list, false);
            }
            break;
            case 4: /* reduce AOrthogonalTerm */
            {
                ArrayList<Object> list = new4();
                push(goTo(1), list, false);
            }
            break;
            case 5: /* reduce AZeroormoreTerm */
            {
                ArrayList<Object> list = new5();
                push(goTo(1), list, false);
            }
            break;
            case 6: /* reduce AOneormoreTerm */
            {
                ArrayList<Object> list = new6();
                push(goTo(1), list, false);
            }
            break;
            case 7: /* reduce AOptionalTerm */
            {
                ArrayList<Object> list = new7();
                push(goTo(1), list, false);
            }
            break;
            case 8: /* reduce AStateFactor */
            {
                ArrayList<Object> list = new8();
                push(goTo(2), list, false);
            }
            break;
            case 9: /* reduce ANestedFactor */
            {
                ArrayList<Object> list = new9();
                push(goTo(2), list, false);
            }
            break;
        }
    }



    @SuppressWarnings({ "unchecked", "rawtypes" })
    ArrayList<Object> new0() /* reduce ATermExp */
    {
        @SuppressWarnings("hiding") ArrayList<Object> nodeList = new ArrayList<Object>();

        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList1 = pop();
        PExp pexpNode1;
        {
            // Block
        PTerm ptermNode2;
        ptermNode2 = (PTerm)nodeArrayList1.get(0);

        pexpNode1 = new ATermExp(ptermNode2);
        }
	nodeList.add(pexpNode1);
        return nodeList;
    }



    @SuppressWarnings({ "unchecked", "rawtypes" })
    ArrayList<Object> new1() /* reduce ASequenceExp */
    {
        @SuppressWarnings("hiding") ArrayList<Object> nodeList = new ArrayList<Object>();

        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList3 = pop();
        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList2 = pop();
        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList1 = pop();
        PExp pexpNode1;
        {
            // Block
        PExp pexpNode2;
        TWhitespace twhitespaceNode3;
        PTerm ptermNode4;
        pexpNode2 = (PExp)nodeArrayList1.get(0);
        twhitespaceNode3 = (TWhitespace)nodeArrayList2.get(0);
        ptermNode4 = (PTerm)nodeArrayList3.get(0);

        pexpNode1 = new ASequenceExp(pexpNode2, twhitespaceNode3, ptermNode4);
        }
	nodeList.add(pexpNode1);
        return nodeList;
    }



    @SuppressWarnings({ "unchecked", "rawtypes" })
    ArrayList<Object> new2() /* reduce AFactorTerm */
    {
        @SuppressWarnings("hiding") ArrayList<Object> nodeList = new ArrayList<Object>();

        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList1 = pop();
        PTerm ptermNode1;
        {
            // Block
        PFactor pfactorNode2;
        pfactorNode2 = (PFactor)nodeArrayList1.get(0);

        ptermNode1 = new AFactorTerm(pfactorNode2);
        }
	nodeList.add(ptermNode1);
        return nodeList;
    }



    @SuppressWarnings({ "unchecked", "rawtypes" })
    ArrayList<Object> new3() /* reduce AAlternativeTerm */
    {
        @SuppressWarnings("hiding") ArrayList<Object> nodeList = new ArrayList<Object>();

        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList3 = pop();
        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList2 = pop();
        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList1 = pop();
        PTerm ptermNode1;
        {
            // Block
        PTerm ptermNode2;
        TOr torNode3;
        PFactor pfactorNode4;
        ptermNode2 = (PTerm)nodeArrayList1.get(0);
        torNode3 = (TOr)nodeArrayList2.get(0);
        pfactorNode4 = (PFactor)nodeArrayList3.get(0);

        ptermNode1 = new AAlternativeTerm(ptermNode2, torNode3, pfactorNode4);
        }
	nodeList.add(ptermNode1);
        return nodeList;
    }



    @SuppressWarnings({ "unchecked", "rawtypes" })
    ArrayList<Object> new4() /* reduce AOrthogonalTerm */
    {
        @SuppressWarnings("hiding") ArrayList<Object> nodeList = new ArrayList<Object>();

        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList3 = pop();
        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList2 = pop();
        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList1 = pop();
        PTerm ptermNode1;
        {
            // Block
        PTerm ptermNode2;
        TMinus tminusNode3;
        PFactor pfactorNode4;
        ptermNode2 = (PTerm)nodeArrayList1.get(0);
        tminusNode3 = (TMinus)nodeArrayList2.get(0);
        pfactorNode4 = (PFactor)nodeArrayList3.get(0);

        ptermNode1 = new AOrthogonalTerm(ptermNode2, tminusNode3, pfactorNode4);
        }
	nodeList.add(ptermNode1);
        return nodeList;
    }



    @SuppressWarnings({ "unchecked", "rawtypes" })
    ArrayList<Object> new5() /* reduce AZeroormoreTerm */
    {
        @SuppressWarnings("hiding") ArrayList<Object> nodeList = new ArrayList<Object>();

        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList2 = pop();
        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList1 = pop();
        PTerm ptermNode1;
        {
            // Block
        PTerm ptermNode2;
        TTimes ttimesNode3;
        ptermNode2 = (PTerm)nodeArrayList1.get(0);
        ttimesNode3 = (TTimes)nodeArrayList2.get(0);

        ptermNode1 = new AZeroormoreTerm(ptermNode2, ttimesNode3);
        }
	nodeList.add(ptermNode1);
        return nodeList;
    }



    @SuppressWarnings({ "unchecked", "rawtypes" })
    ArrayList<Object> new6() /* reduce AOneormoreTerm */
    {
        @SuppressWarnings("hiding") ArrayList<Object> nodeList = new ArrayList<Object>();

        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList2 = pop();
        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList1 = pop();
        PTerm ptermNode1;
        {
            // Block
        PTerm ptermNode2;
        TPlus tplusNode3;
        ptermNode2 = (PTerm)nodeArrayList1.get(0);
        tplusNode3 = (TPlus)nodeArrayList2.get(0);

        ptermNode1 = new AOneormoreTerm(ptermNode2, tplusNode3);
        }
	nodeList.add(ptermNode1);
        return nodeList;
    }



    @SuppressWarnings({ "unchecked", "rawtypes" })
    ArrayList<Object> new7() /* reduce AOptionalTerm */
    {
        @SuppressWarnings("hiding") ArrayList<Object> nodeList = new ArrayList<Object>();

        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList2 = pop();
        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList1 = pop();
        PTerm ptermNode1;
        {
            // Block
        PTerm ptermNode2;
        TQuestionmark tquestionmarkNode3;
        ptermNode2 = (PTerm)nodeArrayList1.get(0);
        tquestionmarkNode3 = (TQuestionmark)nodeArrayList2.get(0);

        ptermNode1 = new AOptionalTerm(ptermNode2, tquestionmarkNode3);
        }
	nodeList.add(ptermNode1);
        return nodeList;
    }



    @SuppressWarnings({ "unchecked", "rawtypes" })
    ArrayList<Object> new8() /* reduce AStateFactor */
    {
        @SuppressWarnings("hiding") ArrayList<Object> nodeList = new ArrayList<Object>();

        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList1 = pop();
        PFactor pfactorNode1;
        {
            // Block
        TId tidNode2;
        tidNode2 = (TId)nodeArrayList1.get(0);

        pfactorNode1 = new AStateFactor(tidNode2);
        }
	nodeList.add(pfactorNode1);
        return nodeList;
    }



    @SuppressWarnings({ "unchecked", "rawtypes" })
    ArrayList<Object> new9() /* reduce ANestedFactor */
    {
        @SuppressWarnings("hiding") ArrayList<Object> nodeList = new ArrayList<Object>();

        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList3 = pop();
        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList2 = pop();
        @SuppressWarnings("unused") ArrayList<Object> nodeArrayList1 = pop();
        PFactor pfactorNode1;
        {
            // Block
        TLparen tlparenNode2;
        PExp pexpNode3;
        TRparen trparenNode4;
        tlparenNode2 = (TLparen)nodeArrayList1.get(0);
        pexpNode3 = (PExp)nodeArrayList2.get(0);
        trparenNode4 = (TRparen)nodeArrayList3.get(0);

        pfactorNode1 = new ANestedFactor(tlparenNode2, pexpNode3, trparenNode4);
        }
	nodeList.add(pfactorNode1);
        return nodeList;
    }



    private static int[][][] actionTable;
/*      {
			{{-1, ERROR, 0}, {0, SHIFT, 1}, {8, SHIFT, 2}, },
			{{-1, ERROR, 1}, {0, SHIFT, 1}, {8, SHIFT, 2}, },
			{{-1, REDUCE, 8}, },
			{{-1, ERROR, 3}, {7, SHIFT, 7}, {9, ACCEPT, -1}, },
			{{-1, REDUCE, 0}, {2, SHIFT, 8}, {3, SHIFT, 9}, {4, SHIFT, 10}, {5, SHIFT, 11}, {6, SHIFT, 12}, },
			{{-1, REDUCE, 2}, },
			{{-1, ERROR, 6}, {1, SHIFT, 13}, {7, SHIFT, 7}, },
			{{-1, ERROR, 7}, {0, SHIFT, 1}, {8, SHIFT, 2}, },
			{{-1, ERROR, 8}, {0, SHIFT, 1}, {8, SHIFT, 2}, },
			{{-1, REDUCE, 6}, },
			{{-1, ERROR, 10}, {0, SHIFT, 1}, {8, SHIFT, 2}, },
			{{-1, REDUCE, 5}, },
			{{-1, REDUCE, 7}, },
			{{-1, REDUCE, 9}, },
			{{-1, REDUCE, 1}, {2, SHIFT, 8}, {3, SHIFT, 9}, {4, SHIFT, 10}, {5, SHIFT, 11}, {6, SHIFT, 12}, },
			{{-1, REDUCE, 3}, },
			{{-1, REDUCE, 4}, },
        };*/
    private static int[][][] gotoTable;
/*      {
			{{-1, 3}, {1, 6}, },
			{{-1, 4}, {7, 14}, },
			{{-1, 5}, {8, 15}, {10, 16}, },
        };*/
    private static String[] errorMessages;
/*      {
			"expecting: '(', id",
			"expecting: ')', '|', '+', '-', '*', '?', whitespace, EOF",
			"expecting: whitespace, EOF",
			"expecting: ')', whitespace",
        };*/
    private static int[] errors;
/*      {
			0, 0, 1, 2, 1, 1, 3, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 
        };*/

    static 
    {
        try
        {
            DataInputStream s = new DataInputStream(
                new BufferedInputStream(
                Parser.class.getResourceAsStream("parser.dat")));

            // read actionTable
            int length = s.readInt();
            Parser.actionTable = new int[length][][];
            for(int i = 0; i < Parser.actionTable.length; i++)
            {
                length = s.readInt();
                Parser.actionTable[i] = new int[length][3];
                for(int j = 0; j < Parser.actionTable[i].length; j++)
                {
                for(int k = 0; k < 3; k++)
                {
                    Parser.actionTable[i][j][k] = s.readInt();
                }
                }
            }

            // read gotoTable
            length = s.readInt();
            gotoTable = new int[length][][];
            for(int i = 0; i < gotoTable.length; i++)
            {
                length = s.readInt();
                gotoTable[i] = new int[length][2];
                for(int j = 0; j < gotoTable[i].length; j++)
                {
                for(int k = 0; k < 2; k++)
                {
                    gotoTable[i][j][k] = s.readInt();
                }
                }
            }

            // read errorMessages
            length = s.readInt();
            errorMessages = new String[length];
            for(int i = 0; i < errorMessages.length; i++)
            {
                length = s.readInt();
                StringBuffer buffer = new StringBuffer();

                for(int j = 0; j < length; j++)
                {
                buffer.append(s.readChar());
                }
                errorMessages[i] = buffer.toString();
            }

            // read errors
            length = s.readInt();
            errors = new int[length];
            for(int i = 0; i < errors.length; i++)
            {
                errors[i] = s.readInt();
            }

            s.close();
        }
        catch(Exception e)
        {
            throw new RuntimeException("The file \"parser.dat\" is either missing or corrupted.");
        }
    }
}