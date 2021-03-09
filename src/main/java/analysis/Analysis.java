/* This file was generated by SableCC (http://www.sablecc.org/). */

package analysis;

import node.*;

public interface Analysis extends Switch
{
    Object getIn(Node node);
    void setIn(Node node, Object o);
    Object getOut(Node node);
    void setOut(Node node, Object o);

    void caseStart(Start node);
    void caseATermExp(ATermExp node);
    void caseASequenceExp(ASequenceExp node);
    void caseAFactorTerm(AFactorTerm node);
    void caseAAlternativeTerm(AAlternativeTerm node);
    void caseAOrthogonalTerm(AOrthogonalTerm node);
    void caseAZeroormoreTerm(AZeroormoreTerm node);
    void caseAOneormoreTerm(AOneormoreTerm node);
    void caseAOptionalTerm(AOptionalTerm node);
    void caseAStateFactor(AStateFactor node);
    void caseANestedFactor(ANestedFactor node);

    void caseTLparen(TLparen node);
    void caseTRparen(TRparen node);
    void caseTOr(TOr node);
    void caseTPlus(TPlus node);
    void caseTMinus(TMinus node);
    void caseTTimes(TTimes node);
    void caseTQuestionmark(TQuestionmark node);
    void caseTWhitespace(TWhitespace node);
    void caseTId(TId node);
    void caseEOF(EOF node);
    void caseInvalidToken(InvalidToken node);
}
